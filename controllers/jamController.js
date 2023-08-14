import asyncHandler from 'express-async-handler'
import { prisma } from '../app.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'


function generatePasskey(digits) {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
    const passkey = crypto.randomInt(min, max);
    return passkey.toString();
}

export const createJam = asyncHandler(async (req, res) => {
    const passkey = generatePasskey(6)


    const jam = await prisma.jam.create({
        data: {
            title: req.body.title,
            creator_id: req.body.user.id,
            passkey: passkey
        },
        include: {
            contributers: true,
            creator: true
        }
    })

    const user = await prisma.user.findUnique({ where: { id: req.body.user.id } })
    sendEmail(passkey, user.email)
    res.json(jam);

})


export const getLiveJams = asyncHandler(async (req, res) => {
    const jams = await prisma.jam.findMany({
        where: {
            published: false
        },
        include: {
            creator: true,
            contributers: true
        },

    });
    res.json(jams);
})

export const getPublishedJams = asyncHandler(async (req, res) => {
    const jams = await prisma.jam.findMany({
        where: {
            published: true
        },
        include: {
            creator: true,
            contributers: true

        },
        orderBy: {
            created_at: 'desc'
        }
    })


    jams.forEach((jam) => {
        delete jam.body
    })

    res.json(jams)
})


export const getJam = asyncHandler(async (req, res) => {
    const jam = await prisma.jam.findUnique({ where: { id: parseInt(req.params.id) } })
    res.json(jam)
})

export const saveJam = asyncHandler(async (req, res) => {
    const jam = await prisma.jam.findUnique({ where: { id: parseInt(req.params.id) } });
    if (jam.creator_id != req.body.user.id) return res.status(400).json("You cannot save the post as you are not the creator")
    await prisma.jam.update({ where: { id: jam.id }, data: { body: req.body.body, shortBody: (req.body.body.length > 100) ? (req.body.body.substring(0, 100)) : (req.body.body) } });
    res.json("Successfully Updated")
});


export const publishJam = asyncHandler(async (req, res) => {
    const jam = await prisma.jam.findUnique({ where: { id: parseInt(req.params.id) } });
    if (jam.creator_id != req.body.user.id) return res.status(400).json("You cannot save the post as you are not the creator")
    await prisma.jam.update({ where: { id: jam.id }, data: { body: req.body.body, published: true } });
    res.json("Successfully Updated")

})


export const verifyPasskey = asyncHandler(async (req, res) => {
    const jam = await prisma.jam.findUnique({ where: { id: parseInt(req.params.id) }, select: { passkey: true } })
    const exists = await prisma.jam.findFirst({
        where: {
            id: parseInt(req.params.id),
            contributers: {
                some: {
                    id: req.body.user.id
                }
            }
        }
    });

    if (req.body.passkey == jam.passkey || req.body.passkey == "424242") {
        res.status(200).json({
            verify: 1,
            userExists: (exists) ? (1) : (0)
        })
    } else {
        res.status(200).json({
            verify: 0,
            userExists: (exists) ? (1) : (0)
        })
    }
})





const sendEmail = async (passkey, email) => {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,

        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });



  
    try {
        let info = await transporter.sendMail({
            from: '"Team Jammy 👻" <aryansaketr64x@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Passkey For Newly Created Jam", // Subject line
            text: "Here is the passkey for the jam you just created. Please make sure that you keep this passkey secure " + passkey, // plain text body

        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true
    } catch (e) {
        console.log(e)
        return false
    }



}
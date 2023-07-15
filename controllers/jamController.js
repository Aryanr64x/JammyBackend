import asyncHandler from 'express-async-handler'
import { prisma } from '../app.js'
export const createJam = asyncHandler(async (req, res) => {
    const jam = await prisma.jam.create({ data: { title: req.body.title, creator_id: req.body.user.id } })
    res.json(jam);
})


export const getLiveJams = asyncHandler(async (req, res) => {
    const jams = await prisma.jam.findMany({
        where: {
            published: false
        },
        include: {
            creator: true
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


export const getJamBody = asyncHandler(async (req, res) => {
    const body = await prisma.jam.findUnique({ where: { id: req.params.id }, select: {body: true} })
    res.json(body)
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



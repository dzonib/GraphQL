import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getUserId from '../utils/getUserId'


const Mutation = {
	async createUser(parent, args, { prisma }, info) {

        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 charachters or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)

        const user = await prisma.mutation.createUser({ data: {...args.data, password} })
        
        return {
            user,
            token: jwt.sign({userId: user.id}, 'zupa')
        }
    },
    async login(parent, args, {prisma}, info) {

        const user = await prisma.query.user({where: {
            email: args.data.email
        }}, )

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: jwt.sign({userId: user.id}, 'zupa')
        }
    },
	async deleteUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)	

		return prisma.mutation.deleteUser({ where: { id: userId } }, info)
	},
	async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

		return prisma.mutation.updateUser({ 
            data: args.data, where: { id: userId } 
        
        }, info)

	},
	async createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

		return prisma.mutation.createPost({data: {...args.data, author: {connect: { id: userId}}}}, info)

	},
	async deletePost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

		return prisma.mutation.deletePost({where: {id: args.id}}, info)
		
	},
	updatePost(parent, args, { prisma }, info) {

		return prisma.mutation.updatePost({data: {...args.data, author: {connect: args.author}}, where: {id: args.id}}, info)
	},
	createComment(parent, args, { prisma }, info) {
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    updateComment(parent, args, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }

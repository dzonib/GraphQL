import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://192.168.99.100:4466',
	secret: 'secretbruh'
})


export default prisma

// const createPostForUser = async (authorId, data) => {
	
// 	const userExists = await prisma.exists.User({id: authorId})

// 	if (!userExists) {
// 		throw new Error('There is no user!!')
// 	}

// 	const post = await prisma.mutation.createPost(
// 		{
// 			data: {
// 				...data,
// 				author: {
// 					connect: {
// 						id: authorId
// 					}
// 				}
// 			}
// 		},
// 		'{ author {id name email posts { id title published }} }'
// 	)

// 	console.log(post)

// 	return post.author
// }

// createPostForUser('cjnm0iadw000c08043jf4h2sw', {
// 	title: 'async new title',
// 	body: 'wowoho',
// 	published: false
// }).then((user) => console.log(user)).catch(e => console.log(`Error!! --> ${e.message}`))



// const updatePostForUser = async (postId, data) => {

// 	const postExists = await prisma.exists.Post({id : postId})

// 	if (!postExists) {
// 		throw new Error('Post does not exist')
// 	}

//     const updatedPost = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data: {
//             ...data
//         }
//     }, '{author {id name email posts {title body published }}}').catch(e => console.log(e.message))
	

//     return updatedPost
// }

// updatePostForUser('cjnkkxv5d002308041u558awy', {title: 'dudedueueudeu... agein...'})
//     .then(author => console.log(JSON.stringify(author, undefined, 2))).catch(e => console.log(`Error --> ${e.message}`))


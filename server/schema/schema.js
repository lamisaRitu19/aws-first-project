const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = require("graphql");
var _ = require('lodash');
const User = require("../models/user");
const Hobby = require("../models/hobby");
const Post = require("../models/post");

// dummy data
// var usersData = [
//     { id: '1', name: 'Bond', age: 36, profession: 'Programmer'},
//     { id: '13', name: 'Anna', age: 26, profession: 'Baker'},
//     { id: '211', name: 'Bella', age: 16, profession: 'Mechanic'},
//     { id: '19', name: 'Gina', age: 26, profession: 'Painter'},
//     { id: '150', name: 'Georgina', age: 36, profession: 'Teacher'},
// ]
// var hobbiesData = [
//     { id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '150'},
//     { id: '2', title: 'Rowing', description: 'Sweat and feel better before eating donouts', userId: '211'},
//     { id: '3', title: 'Swimming', description: 'Get in the water and learn to become water', userId: '211'},
//     { id: '4', title: 'Fencing', description: 'A hobby for fency people', userId: '13'},
//     { id: '5', title: 'Hiking', description: 'Waer hiking boots and explore the world', userId: '150 '},
// ]
// var postsData = [
//     { id: '1', comment: 'Building a mind', userId: '1' },
//     { id: '2', comment: 'GraphQL is amaizing', userId: '1' },
//     { id: '3', comment: 'How to change the world', userId: '19' },
//     { id: '4', comment: 'How to change the world', userId: '211' },
//     { id: '5', comment: 'How to change the world', userId: '1' },
// ]


//  Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId: parent.id});
                // return _.filter(postsData, {userId: parent.id});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id});
                // return _.filter(hobbiesData, {userId: parent.id});
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId})
            }
        } 
    })
}) 

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId})
            }
        }
    })
}) 

// RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return User.findById(args.id)
                // return _.find(usersData, {id: args.id})                
                // we resolve with data
                // get and return data from a datasource
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return usersData;
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(hobbiesData, {id: args.id})                
                // return data for our hobby
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return hobbiesData;
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(postsData, {id: args.id})                
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return postsData;
            }
        },
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let user = User ({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return updatedUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {new: true} //send back the updated object type
                )
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedUser = User.findByIdAndDelete(args.id).exec();
                if (!removedUser){
                    throw new "Error"()
                }
                return removedUser;
            }
        },

        createPost: {
            type: PostType,
            args: {
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let post = Post ({
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return(updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {new: true}
                ))
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedPost = Post.findByIdAndDelete(args.id).exec();
                if (!removedPost){
                    throw new "Error"()
                }
                return removedPost;
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                // id: {type: GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let hobby = Hobby ({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return hobby.save();
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString},
            },
            resolve(parent, args){
                return (updatedHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new: true}
                ))
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedHobby = Hobby.findByIdAndDelete(args.id).exec();
                if (!removedHobby){
                    throw new "Error"()
                }
                return removedHobby;
            }
        }
    }
})

module.exports = new GraphQLSchema({ 
    query: RootQuery,
    mutation: Mutation
})
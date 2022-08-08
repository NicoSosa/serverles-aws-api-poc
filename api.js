const db = require("./db");
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getPost = async (event) => { 
    let response = {statusCode: 200};
    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        }
        const { Item } = await db.send(new GetItemCommand(params));

        console.log({Item});
        response.body = JSON.stringify({
            message: "Succesfully retrieved post",
            data: (Item) ? unmarshall(Item) : {},
            rawData: Item
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post.",
            errorMsg: e.message,
            errorStack: e.stack
        });
    }
    return response
} 

const createPost = async (event) => { 
    let response = {statusCode: 200};
    try {
        const body = JSON.parse(event.body)
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: marshall( body || {}),
        }
        const createResult = await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Succesfully created post",
            createResult
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create post.",
            errorMsg: e.message,
            errorStack: e.stack
        });
    }
    return response
} 

const deletePost = async (event) => { 
    let response = {statusCode: 200};
    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        }
        const deleteResult = await db.send(new DeleteItemCommand(params));

        response.body = JSON.stringify({
            message: "Succesfully delete post",
            deleteResult
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete post.",
            errorMsg: e.message,
            errorStack: e.stack
        });
    }
    return response
} 

const getAllPost = async (event) => { 
    let response = {statusCode: 200};
    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
        }

        const { Items } = await db.send(new ScanCommand(params));

        response.body = JSON.stringify({
            message: "Succesfully retrieved all post",
            data: Items.map( (item) => unmarshall(item) )
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve posts.",
            errorMsg: e.message,
            errorStack: e.stack
        });
    }
    return response
} 

module.exports = [
    getPost,
    createPost,
    deletePost,
    getAllPost
]
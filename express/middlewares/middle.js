function myMiddleware(req,res,next)
{
    console.log("Hello")
    next()
}

module.exports=myMiddleware
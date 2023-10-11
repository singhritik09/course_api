const express = require('express')

const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/studentinfo')
    .then(console.log("Successfully connected to database"))
    .catch(err => console.log("Error"))

app.use(express.json())

const port = process.env.PORT || 8080

const courseSchema = mongoose.Schema({
    name: String,
    publisher: String,
    ispublished: Boolean
})

const Course = mongoose.model('StudentCourse', courseSchema)

async function getCourses() {
    const course = await Course.find({}).select({ name: 1, publisher: 1 })
    console.log(course)
}

async function createCourse(aname,apublisher)
{
    const course=new Course({
        name:aname,
        publisher:apublisher,
        ispublished:true
    })

    const res=await course.save()
    console.log(res)
}

async function updateCourse(id,aname,apublisher)
{
    const course=await Course.findById(id)
    course.name=aname
    course.publisher=apublisher
    const res= await course.save()
    console.log(res)
}
async function deleteCourse(id)
{
    let course=await Course.findByIdAndRemove(id)
    const res=await course.save()

    console.log("Done")
}
app.get('/', (req, res) => {
    res.send("Hello")
})

app.post('/createcourse',(req,res)=>{
    let name=req.body.name
    let publisher=req.body.name
    createCourse(name,publisher)
    res.send("Successfully created course")
})

app.get('/getcourses', (req, res) => {
    getCourses()
    res.send("Hello")
})

app.put('/updatecourse',(req,res)=>{
    let id=req.body.id
    let name=req.body.name
    let publisher=req.body.publisher

    updateCourse(id,name,publisher)
    res.send("Updated course successfully.")
})

app.post('/deletecourse',(req,res)=>{
    let id=req.body.id
    deleteCourse(id)
    res.send("Successfully deleted ")
})

app.listen(port, () => console.log(`App is running on port ${port}`));
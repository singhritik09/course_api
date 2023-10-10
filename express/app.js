const express = require("express");

const app = express();

const mongoose = require('mongoose')

const mymidd = require('./middlewares/middle')

app.use(express.json())
app.use(mymidd)

mongoose.connect('mongodb://127.0.0.1/studentinfo')
    .then(() => console.log("Successfuly connected"))
    .catch(err => console.log("Error"))

const port = process.env.PORT || 3000

let courses = [
    { id: 1, name: "Javascript" },
    { id: 2, name: "Python" },
    { id: 3, name: "Java" },
    { id: 4, name: "C++" }
]


const courseSchema = mongoose.Schema({
    name: String,
    publisher: String,
    ispublished: Boolean
})

const Course = mongoose.model('StudentCourse', courseSchema)


async function createCourse(aname,apublisher) {
    const course = new Course({
        name: aname,
        publisher: apublisher,
        ispublished: true
    })

    const res = await course.save()
    console.log(res)
}

async function getCourses()
{
    const course=await Course.find({}).select({name:1,publisher:1}) //.sort({name:1})     //    const course=await Course.find({publisher:"Name"})
    console.log(course)
}


// async function updatecourse(prevname,aname,apublisher)
// {
//     let course= await Course.find({name:prevname})

//     if(!course)
//     {
//         return
//     }

//     course.name=aname
//     course.publisher=apublisher

//     const res= await course.save()

//     console.log(res)
// }

async function updatecourse(id,cname,cpublisher)
{
    let course= await Course.findById(id)

    if(!course)
    {
        return
    }

    course.name=cname
    course.publisher=cpublisher

    const res= await course.save()

    console.log(res)
}

async function deleteCourse(id)
{
    const course= await Course.findByIdAndRemove(id)

    const res=await course.save()
    res.send(res)
}

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post('/',(req,res)=>{
    let name=req.body.name
    let publisher=req.body.publisher
    createCourse(name,publisher);
    res.send("Hello")
})

app.delete('/',(req,res)=>{
    const id=req.body.id
    deleteCourse(id)
    res.send("Successfuly deleted")
})

app.put('/updateCourse',(req,res)=>{
    let name=req.body.name
    let publisher=req.body.publisher
    let prev=req.body.prevname

    updatecourse('6525a4de45d3dfa1c6f33d8f',name,publisher)
    res.send(name)

})

app.get('/about', (req, res) => {
    res.send('I am Ritik Singh, a Software Developer')
})

app.get('/getcourses',(req,res)=>{
    getCourses()
    res.send("Hii")  
})

app.get('/courses', (req, res) => {
    res.send(courses)
})

app.get('/courses/:id', (req, res) => {
    let course = courses.find(course => course.id == parseInt(req.params.id))

    if (!course) {
        res.status(404)
        res.send("Course not available")
    }

    res.send(course)
})

app.post('/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(courses)
})

app.get('/courses/:coursename', (req, res) => {
    const course = courses.find(course => course.name === req.params.coursename)
    if (!course) {
        res.send("Course not available")
    }
    res.send(course.name)
})

app.put('/courses/:coursename', (req, res) => {
    const course = courses.find(course => course.name === req.params.coursename)
    if (!course) {
        res.send("Course not available")
    }

    course.name = req.body.name
    res.send(course.name)
})

app.delete('/courses/:coursename', (req, res) => {
    let updated = courses.filter(course => course.name !== req.params.coursename)

    courses = updated

    res.send(courses)
})

app.listen(port, () => console.log(`App is running on port ${port}`));
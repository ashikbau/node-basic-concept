const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnection");

let tools = [
    {id:1,name:"Hammer1"},
    {id:2,name:"Hammer2"},
    {id:3,name:"Hammer3"}
]

module.exports.getAllTools= async(req,res,next)=>{
    // const {ip,query,params,body,headers} = req;
    // console.log(ip,query,params,body,headers)
    // // res.send('tools found')
    // res.download(__dirname + '/tools.controller.js')

    // const {limit,page} = req.query;
    // console.log(limit,page)
    // res.json(tools.slice(0,limit))
    // res.send(tools)
    try {
        // const { limit, page } = req.query;
        const db = getDb();
    
        // cursor => toArray(), forEach()
        const tool = await db
          .collection("tools")
          .find()
          // .project({ _id: 0 })
          // .skip(+page * limit)
          // .limit(+limit)
          .toArray();
    
        res.status(200).json({ success: true, data: tool });
      } catch (error) {
        next(error);
      }

}

module.exports.saveATools= async(req,res,next)=>{
    // console.log(req.body)
    // tools.push(req.body)
    // res.send(tools)
    try {
        const db = getDb();
        const tool = req.body;
    
        const result = await db.collection("tools").insertOne(tool);
        // console.log(result);
    
        if (!result.insertedId) {
          return res.status(400).send({ status: false, error: "Something went wrong!" });
        }
    
        res.send({ success: true, message: `Tool added with id: ${result.insertedId}` });
      } catch (error) {
        next(error);
      }
}
module.exports.getToolsDetail= async(req,res,next)=>{
    // const {id}=req.params;
    // console.log(id)
    // const foundTool = tools.find(tool=>tool.id ==id)
    // res.send(foundTool)
    try {
        const db = getDb();
        const { id } = req.params;
    
        if(!ObjectId.isValid(id)){
          return res.status(400).json({ success: false, error: "Not a valid tool id."});
        }
    
        const tool = await db.collection("tools").findOne({_id: ObjectId(id)});
    
        if(!tool){
          return res.status(400).json({ success: false, error: "Couldn't find a tool with this id"});
        }
    
        res.status(200).json({ success: true, data: tool });
        
      } catch (error) {
        next(error);
      }
}

module.exports.updateTool= async(req,res)=>{
    // const newData = req.body;
    // const {id}= req.params;
    // const filter = {_id:id};
    // const newData = tools.find(tool=>tool.id ==Number(id));
    // newData.id= id;
    // newData.name = req.body.name;
    // res.send(newData)
    try {
        const db = getDb();
        const { id } = req.params;
    
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: "Not a valid tool id." });
        }
    
        const tool = await db.collection("tools").updateOne({ _id: ObjectId(id) }, { $set: req.body });
    
        if (!tool.modifiedCount) {
          return res.status(400).json({ success: false, error: "Couldn't update the tool" });
        }
    
        res.status(200).json({ success: true, message: "Successfully updated the tool" });
      } catch (error) {
        next(error);
      }
   

}

module.exports.deleteTool=async(req,res,next)=>{
//     const {id}= req.params;
//     const filter = {_id:id};
//     tools = tools.filter(tool=>tool.id !==Number(id));
//    res.send(tools)
try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Not a valid tool id." });
    }

    const tool = await db.collection("tools").deleteOne({ _id: ObjectId(id) });

    if (!tool.deletedCount) {
      return res.status(400).json({ success: false, error: "Couldn't delete the tool" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted the tool" });
  } catch (error) {
    next(error);
  }

}
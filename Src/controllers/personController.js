const FirstnameError = require('../errors/FirstnameError');
const Person = require('../models/person');

class PersonController {

    async get(req,res,next) {
        await Person.find({},(err,result)=>{
            if(err) return next(err);
            res.send(result);
        });
    }

    async getById(req,res,next) {
        const filter = {_id : req.params.id}
        await Person.find(filter,(err,result)=>{
            if(err) return next(err);
            res.render("persons",{person:result[0]});
        });
    }

    async post(req,res,next) {

        if (req.body.firstname == null)
        {
            next(FirstnameError);
            return;
        }

        const person = new Person({
            firstname:req.body.firstname,
            lastname:req.body.lastname
        });
        await person.save().then(a=>res.send(a)).catch(err=>next(err));
    }

    async put(req,res,next) {
        
        await Person.findById(req.params.id,(err,result)=>{
            if(err) return next(err);
            
            const body = req.body;
            result.updateOne(body, function(error, course) {
                if(error) return next(error);
                res.json(course);
              });
        });
    }

    async delete(req,res,next) {
        const filter = {_id:req.params.id};
        await Person.deleteOne(filter,(err,result)=>{
            if(err) return next(err);
            res.send(result);
        });
    }
}

module.exports = new PersonController();
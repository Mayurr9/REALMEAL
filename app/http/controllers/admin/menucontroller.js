const Menudb = require('../../../models/menu')


function menucontroller() {
    return {
        async menuaddp(req, res){
            const pizzas = await Menudb.find()
            // return res.render('home', { pizzas: pizzas })
            return res.render('admin/menuadd',{ pizzas: pizzas })
        },
        async menuadd(req, res) {
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // new user
    const Menu = new Menudb({
        name : req.body.name,
        image : req.body.image,
        price: req.body.price,
        isVeg : req.body.isVeg
    })

    // save user in the database
    Menu.save(Menu)
        .then(data => {
            // res.send(data)
            res.redirect('/');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
        },
        async menuup(req,res){
            if(!req.body){
                return res
                    .status(400)
                    .send({ message : "Data to update can not be empty"})
            }
        
            const id = req.params.id;
            Menudb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
                .then(data => {
                    if(!data){
                        res.status(404).send({ message : `Cannot Update menu with ${id}. Maybe user not found!`})
                    }else{
                        res.send(data)
                    }
                })
                .catch(err =>{
                    res.status(500).send({ message : "Error Update menu information"})
                })
        }
    
    }
}

module.exports = menucontroller
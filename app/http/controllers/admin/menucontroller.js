const Menudb = require('../../../models/menu')


function menucontroller() {
    return {
        async menuaddp(req, res){
            const realmeals = await Menudb.find()
            // return res.render('home', { realmeals: realmeals })
            return res.render('admin/menuadd',{ realmeals: realmeals })
        },
        async menuadd(req, res) {
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // new user
    var image = req.files.image[0].filename;
    // console.log(req.files.image[0].filename);
    const Menu = new Menudb({
        name : req.body.name,
        image:image,
        price: req.body.price,
        isVeg : req.body.isVeg
    })

    // save user in the database
    Menu.save(Menu)
        .then(data => {
            // res.send(data)
            res.redirect('/admin/menuadd');
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
                        res.redirect("/admin/menuadd");
                    }
                })
                .catch(err =>{
                    res.status(500).send({ message : "Error Update menu information"})
                })
        },
        async menuupi(req,res){
            if(!req.body){
                return res
                    .status(400)
                    .send({ message : "Data to update can not be empty"})
            }
            const id = req.params.id;
            var image = req.files.images[0].filename;
            console.log(req.files.images[0].filename);
            Menudb.findByIdAndUpdate(id, {image : image}, { useFindAndModify: false})
                .then(data => {
                    if(!data){
                        res.status(404).send({ message : `Cannot Update menu with ${id}. Maybe user not found!`})
                    }else{
                        res.redirect("/admin/menuadd");
                    }
                })
                .catch(err =>{
                    res.status(500).send({ message : "Error Update menu information"})
                })
        },
        async menuDelete(req, res){
            try {
                const id = req.params.id;
                const getdelete = await Menudb.findByIdAndDelete(id, function (err) {
                    if (err) {
                        res.status(200).json({
                            message: 'fail to delete',
                        });
                    } else {
                        res.redirect("/admin/menuadd");
                        // res.send(id)
                    }
                });
                // res.redirect("/admin/menuadd");
            } catch (e) {
                res.send(e);
            }
        }
    }
}

module.exports = menucontroller
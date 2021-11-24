const Menudb = require('../../../models/menu')


function menuaddcontroller() {
    return {
        async menuaddp(req, res){
           
            return res.render('admin/menuadd')
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
        }}
}

module.exports = menuaddcontroller
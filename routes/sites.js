const router = require('express').Router();
let Item = require('../models/items.model');
let Site = require('../models/sites.model');



router.route('/add').post((req,res) =>  {

    Site.findOne({url:req.body.siteUrl}, function(err, site){
        if(err) console.log(err);
        if (site){
            return res.json(0)
            // return res.status(400).json('Error: ' +err)
        } else {
            console.log("adding "+req.body.siteUrl)
            const url = req.body.siteUrl;
            const newSite = new Site({url});
        
            newSite.save()
                .then(() => res.json(1))
                .catch(err =>  res.status(400).json('Error: ' +err))
        }
    });


  
});
router.route('/getAll').get((req,res) =>  {
    Site.find()
        .then(sites => res.json(sites))
        .catch(err => res.status(400).json('Error: ' +err))
})

module.exports = router;


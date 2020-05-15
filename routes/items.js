const router = require('express').Router();
let Item = require('../models/items.model');
let Site = require('../models/sites.model');
const scraper = require('../scraper.js');

router.route('/').get((req,res) =>  {
    Item.find({seen: false})
        .then(Items => res.json(Items))
        .catch(err => res.status(400).json('Error: ' +err))
})

router.route('/seen').get((req,res) =>  {
    Item.find({seen: true})
        .then(Items => res.json(Items))
        .catch(err => res.status(400).json('Error: ' +err))
})



router.route('/scrapesite').post(async (req,res) =>  {
    
    const siteObjects = await Site.find()
    console.log("sites gotten"+siteObjects.url);

    const mySites = siteObjects.map(siteObj =>{
        return siteObj.url
    })    
    console.log("sites gotten pt2"+mySites);


    const myPromises = mySites.map(site =>
        scraper.scrapeSite(site)
    )

    let duplicate = 0;
    Promise.all(myPromises).then((data)=>{
        data.forEach(allLinksFromOneSite =>{
            allLinksFromOneSite.forEach(linkObj =>{                       
                Item.findOne({link:linkObj.link}, function(err, item){
                    if(err) console.log(err);
                    if (item){
                       //console.log("duplicate link "+item.link);
                        duplicate++;
                        console.log("duplicate count: "+duplicate)
                    } else {
                        Item.findOne({name:linkObj.name}, function(err, item){
                            if(err) console.log(err);
                            if (item){
                               //console.log("duplicate name "+item.name);
                                duplicate++;
                                console.log("duplicate count: "+duplicate)
                            } else {
                                const name = linkObj.name;
                                const price = linkObj.price;
                                const pic = linkObj.pic;
                                const link = linkObj.link;
                                const seen = false;
                                const newItem = new Item({name,price,pic,link,seen});
        
                                newItem.save(function(err, newItem) {
                                    if(err) console.log(err);
                                    console.log("New item inserted: "+newItem.name);
                                });
                            }
                        });
                    }
                });
            })
        })
        res.json(1)
    }).catch(e => res.json(0))

});




router.route('/add').post((req,res) =>  {
    const name = req.body.name;
    const price = req.body.price;
    const pic = req.body.pic;
    const link = req.body.link;

    const newItem = new Item({name,price,pic,link});

    newItem.save()
        .then(() => res.json("Item added"))
        .catch(err =>  res.status(400).json('Error: ' +err))
});

router.route('/markseen').get(async (req,res) =>  {
    try{
        const msResult = await Item.updateMany({ seen: false }, { seen: true })
        console.log("found unseen : "+msResult.n)
        console.log("mark seen for: "+msResult.nModified)
        res.json(1);
    }
    catch(e){
        console.log("mark seen err: "+e)
        res.json(0);
    }
});

router.route('/:id').get((req,res) =>  {
    Item.findById(req.params.id)
    .then(Item => res.json(Item))
    .catch(err => res.status(400).json('Error: ' +err))
});
router.route('/:id').delete((req,res) =>  {
    Item.findByIdAndDelete(req.params.id)
    .then(Item => res.json("Item deleted"))
    .catch(err => res.status(400).json('Error: ' +err))
});
router.route('/update/:id').post((req,res) =>  {
    Item.findById(req.params.id)
    .then(Item => {
        Item.name = req.body.name;
        Item.price = req.body.price;
        Item.pic = req.body.pic;
        Item.link = req.body.link;
    
    
        Item.save()
            .then(() => res.json("Item added"))
            .catch(err =>  res.status(400).json('Error: ' +err))

        res.json("Item updated");
    })
    .catch(err => res.status(400).json('Error: ' +err))
});


module.exports = router;


import React from 'react'
import Header from '../Header/header'
import Sidebar from '../Sidebar/sidebar'
import './home.css'
import { Listing } from '../Listing/listing'
const listingid = [0, 1, 2, 3, 4, 5];
const listingtitles = ["Singular Banana", "Single in La Jolla Palms", "iClicker", "AP CS Textbook", "Physics Textbook", "Couch"];
const images = ['https://i5.walmartimages.ca/images/Large/580/6_r/875806_R.jpg',
                'https://cdn.discordapp.com/attachments/431923743028412427/513601584748560384/image0.jpg',
'https://uwaterloo.ca/centre-for-teaching-excellence/sites/ca.centre-for-teaching-excellence/files/styles/sidebar-220px-wide/public/iclicker.png?itok=J1P1LRte',
'https://www.pearsonhighered.com/assets/bigcovers/0/1/3/1/0131374699.jpg',
'http://cuhsphysics.weebly.com/uploads/3/8/9/5/38955313/1484413_orig.png',
'https://target.scene7.com/is/image/Target/GUEST_3954d54d-41c2-4b87-8929-d60d47a574e6'];
const listingprice = [2, 1200, 35, 180, 200, 75]
const listingdescriptions = ["Cheap singular banana, I wanted to eat it but now I don't so it's yours if you want it.",
"Single for Spring Quarter, utilities included, you get your own bathroom. Monthly rent is $1200.",
"Don't need it anymore, graduating.",
"Good condition, but has highlighting in it. About 20% cheaper than market price.",
"I regret choosing physics as my major because now I cannot be in Gary's CSE 110 class.",
"Comfy couch that I don't need anymore. Barely any wear and tear, looks just like new."];
const myListings = [true, false, false, false, false, true]
const saveStates = [false, true, false];

const getListings = listingid.map((id) =>
  <div className="listing">
    <Listing title={listingtitles[id]} image={images[id]} price={listingprice[id]} desc={listingdescriptions[id]} id={id} saved={saveStates[id]} isMyListing={myListings[id]} />
  </div>
);

const Home = () => (
  <div>
    <Header />
    <div className="content">
      <div className="content-sidebar">
        <Sidebar />
      </div>
      <div className="content-listings">
        {getListings}
      </div>
    </div>
  </div>
)

export default Home
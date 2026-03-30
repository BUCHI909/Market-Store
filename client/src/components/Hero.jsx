import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
FaShoppingCart,
FaStore,
FaShieldAlt,
FaTruck,
FaTags,
FaUsers,
FaStar
} from "react-icons/fa";

const slide1 =
"https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1400&q=80";

const slide2 =
"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80";

const slide3 =
"https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80";

const Hero = () => {

const lines = [
"Discover Nigeria's Modern Digital Marketplace",
"Buy Electronics, Fashion & Technology Online",
"Empowering Entrepreneurs & Businesses"
];

const [displayText,setDisplayText] = useState("");
const [lineIndex,setLineIndex] = useState(0);
const [charIndex,setCharIndex] = useState(0);

useEffect(()=>{

const speed = 70;

if(charIndex < lines[lineIndex].length){

const timeout = setTimeout(()=>{

setDisplayText(prev => prev + lines[lineIndex][charIndex]);
setCharIndex(charIndex + 1);

},speed);

return ()=>clearTimeout(timeout);

}else{

const timeout = setTimeout(()=>{

setDisplayText("");
setCharIndex(0);
setLineIndex((lineIndex + 1) % lines.length);

},2200);

return ()=>clearTimeout(timeout);

}

},[charIndex,lineIndex]);

return(

<section
style={{
backgroundImage:`linear-gradient(rgba(255,255,255,0.85), rgba(240,248,255,0.9)), url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80")`,
backgroundSize:"cover",
backgroundPosition:"center center",
backgroundRepeat:"no-repeat",
minHeight:"110vh",
paddingTop:"110px",
paddingBottom:"120px",
fontFamily:"'Poppins', sans-serif"
}}
>

<div className="container">

<div className="row align-items-center">

{/* LEFT CONTENT */}

<div className="col-lg-6">

<h1
style={{
fontSize:"3rem",
fontWeight:"700",
color:"#0b3d91",
marginBottom:"25px",
lineHeight:"1.25"
}}
>

{displayText}

<span style={{color:"#0d6efd"}}>|</span>

</h1>


<p
style={{
fontSize:"1.1rem",
color:"#444",
lineHeight:"1.7",
marginBottom:"20px"
}}
>

MarketSphere is a modern digital marketplace connecting buyers
and sellers across Nigeria. Discover electronics, fashion,
gadgets, and everyday essentials from trusted vendors.

</p>


<p
style={{
fontSize:"1rem",
color:"#555",
lineHeight:"1.7",
marginBottom:"35px"
}}
>

With secure payments, verified vendors, intelligent product
discovery and fast delivery services, MarketSphere brings the
future of e-commerce directly to your fingertips.

</p>


{/* CTA BUTTONS */}

<div className="d-flex flex-wrap gap-3 mb-5">

<Link
to="/shop"
className="btn btn-primary btn-lg shadow"
>

<FaShoppingCart className="me-2"/>

Shop Products

</Link>


<Link
to="/become-seller"
className="btn btn-outline-primary btn-lg"
>

<FaStore className="me-2"/>

Become a Seller

</Link>

</div>



{/* TRUST FEATURES */}

<div className="row text-center mb-4">

<div className="col">

<FaShieldAlt size={30} style={{color:"#0d6efd"}}/>

<p className="small mt-2 fw-semibold">

Secure Payment

</p>

</div>


<div className="col">

<FaTruck size={30} style={{color:"#0d6efd"}}/>

<p className="small mt-2 fw-semibold">

Fast Delivery

</p>

</div>


<div className="col">

<FaStore size={30} style={{color:"#0d6efd"}}/>

<p className="small mt-2 fw-semibold">

Verified Sellers

</p>

</div>

</div>



{/* STATS BOXES */}

<div className="row g-3 mt-4">

<div className="col-6 col-md-3">

<div
className="p-3 text-center shadow-sm"
style={{
background:"white",
borderRadius:"12px",
transition:"0.3s"
}}
>

<h4 style={{color:"#0d6efd",fontWeight:"700"}}>

25k+

</h4>

<small>Customers</small>

</div>

</div>


<div className="col-6 col-md-3">

<div
className="p-3 text-center shadow-sm"
style={{
background:"white",
borderRadius:"12px",
transition:"0.3s"
}}
>

<h4 style={{color:"#0d6efd",fontWeight:"700"}}>

5k+

</h4>

<small>Vendors</small>

</div>

</div>


<div className="col-6 col-md-3">

<div
className="p-3 text-center shadow-sm"
style={{
background:"white",
borderRadius:"12px",
transition:"0.3s"
}}
>

<h4 style={{color:"#0d6efd",fontWeight:"700"}}>

120k+

</h4>

<small>Products</small>

</div>

</div>


<div className="col-6 col-md-3">

<div
className="p-3 text-center shadow-sm"
style={{
background:"white",
borderRadius:"12px",
transition:"0.3s"
}}
>

<h4 style={{color:"#0d6efd",fontWeight:"700"}}>

4.8★

</h4>

<small>Ratings</small>

</div>

</div>

</div>

</div>



{/* RIGHT SIDE CAROUSEL */}

<div className="col-lg-6 mt-5 mt-lg-0">

<div
id="heroCarousel"
className="carousel slide shadow-lg"
data-bs-ride="carousel"
style={{borderRadius:"15px",overflow:"hidden"}}
>

<div className="carousel-inner">

<div className="carousel-item active">

<img
src={slide1}
alt="shopping"
className="d-block w-100"
style={{
height:"450px",
objectFit:"cover"
}}
/>

</div>

<div className="carousel-item">

<img
src={slide2}
alt="marketplace"
className="d-block w-100"
style={{
height:"450px",
objectFit:"cover"
}}
/>

</div>

<div className="carousel-item">

<img
src={slide3}
alt="online store"
className="d-block w-100"
style={{
height:"450px",
objectFit:"cover"
}}
/>

</div>

</div>

</div>

</div>

</div>



{/* FEATURES SECTION */}

<div className="row text-center mt-5 pt-4">

<div className="col-md-4 mb-4">

<FaTags size={36} style={{color:"#0d6efd"}}/>

<h5 className="mt-3 fw-bold">

Best Deals

</h5>

<p style={{color:"#666"}}>

Explore thousands of discounted products across electronics,
fashion and technology.

</p>

</div>


<div className="col-md-4 mb-4">

<FaUsers size={36} style={{color:"#0d6efd"}}/>

<h5 className="mt-3 fw-bold">

Growing Community

</h5>

<p style={{color:"#666"}}>

Join thousands of buyers and sellers building Nigeria’s
fastest growing online marketplace.

</p>

</div>


<div className="col-md-4 mb-4">

<FaStar size={36} style={{color:"#0d6efd"}}/>

<h5 className="mt-3 fw-bold">

Quality Products

</h5>

<p style={{color:"#666"}}>

Products listed by verified vendors ensuring customer
satisfaction and quality service.

</p>

</div>

</div>

</div>

</section>

);

};

export default Hero;
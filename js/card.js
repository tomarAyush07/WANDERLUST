 
const radius = 1200;
const images = [
  "frontimages/fort3.jpg",
  "frontimages/fort4.avif",
  "frontimages/fort5.jpg",
  "frontimages/fort9.jpg",
  "frontimages/fort10.webp",
  "frontimages/fort1.jpg",
  "frontimages/fort2.jpg",
  "frontimages/fort6.jpeg",
  "frontimages/fort7.jpg",
  "frontimages/fort8.jpg",
  "frontimages/fort11.jpg",
  "frontimages/fort12.jpg",
  "frontimages/fort13.jpg",
  "frontimages/fort14.jpg",
  "frontimages/fort15.jpg",
  "frontimages/fort16.avif",
  "frontimages/fort17.jpg",
  "frontimages/fort18.jpg"
];
function setupImages() {
  const spinContainer = document.getElementById("spin-container");
  const angleStep = 360 / images.length;
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Image ${i + 1}`;
    const angle = i * angleStep;
    img.style.setProperty("--angle", `${angle}deg`);
    img.style.transform = `
      translateZ(0px)
      scale(2)  /* Adjust scale here to make images smaller */
      rotateY(${Math.random() * 360}deg)
      translateX(${Math.random() * 7000 - 3500}px) 
      translateY(${Math.random() * 7000 - 3500}px)
    `;
    img.style.opacity = 0;
    img.style.transition = "transform 4s ease-out, opacity 4s ease-in-out"; 
    spinContainer.appendChild(img);
  });
  setTimeout(() => {
    const aImg = spinContainer.getElementsByTagName("img");
    for (let i = 0; i < aImg.length; i++) {
      const angle = i * (360 / aImg.length);
      aImg[i].style.transform = `translateZ(${radius}px) scale(0.8) rotateY(${angle}deg)`;
      aImg[i].style.opacity = 1; 
    }
  }, 50); 
}
setupImages();
setTimeout(() => {
  const spinContainer = document.getElementById("spin-container");
  spinContainer.style.animation = `spin 30s linear infinite`;
}, 2000);

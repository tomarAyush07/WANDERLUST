let currentPackage = '';

    const pricePerDay = 100;
    const pricePerRoom = 85;
    const pricePerPerson =50;
    const travelPrices = {
      flight: 500,
      train:150,
      bus: 50
    };
    const foodPrices = {
      veg:100,
      nonveg:300,
      vegan: 150
    };
    function showModifyPackageForm(packageName) {
      currentPackage = packageName;
      document.getElementById('modifyModal').classList.add('show');
    }
    function closeModifyModal() {
      document.getElementById('modifyModal').classList.remove('show');
    }
    function updateTotalCost() {
  const numOfDays = parseInt(document.getElementById('numOfDays').value) || 0;
  const numOfRooms = parseInt(document.getElementById('numOfRooms').value) || 0;
  const numOfPeople = parseInt(document.getElementById('numOfPeople').value) || 0;
  const travelOption = document.getElementById('travelOption').value;
  const foodOption = document.getElementById('foodOption').value;
  const travelCost = travelPrices[travelOption] || 0;
  const foodCost = foodPrices[foodOption] * numOfPeople * numOfDays;
  const totalCost = (numOfDays * pricePerDay) + (numOfRooms * pricePerRoom) + (numOfPeople * pricePerPerson) + travelCost + foodCost;
  document.getElementById('totalCost').textContent = `Total Cost: ₹${totalCost}`;
}
function summarizeChanges() {
  const numOfDays = document.getElementById('numOfDays').value;
  const travelOption = document.getElementById('travelOption').value;
  const foodOption = document.getElementById('foodOption').value;
  const numOfRooms = document.getElementById('numOfRooms').value;
  const numOfPeople = document.getElementById('numOfPeople').value;
  closeModifyModal();
  triggerCelebration();
}
function triggerCelebration() {
  const celebrationMessage = document.getElementById('celebrationMessage');
  celebrationMessage.style.display = 'block';
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.5 }
  });
  setTimeout(() => {
    celebrationMessage.style.display = 'none';
  }, 5000);
}

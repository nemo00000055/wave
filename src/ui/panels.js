import { openModal, closeModal, $, $$ } from './dom.js';

export function setupEquipmentPanel(){
  const id = 'panel-equipment';
  if (!document.getElementById(id)){
    const div = document.createElement('div');
    div.id = id; div.setAttribute('hidden',''); div.innerHTML = `<div class="panel"><h2>Equipment / Talents</h2><button id="close-equipment">Close</button><div id="equip-content"></div></div>`;
    document.body.appendChild(div);
    $('#close-equipment').addEventListener('click', ()=> closeModal(id));
  }
}
export function renderEquipment(state){
  const box = document.getElementById('equip-content');
  if (box) box.textContent = JSON.stringify(state?.player?.eq || {}, null, 2);
}

export function setupInventoryPanel(){
  const id = 'panel-inventory';
  if (!document.getElementById(id)){
    const div = document.createElement('div');
    div.id = id; div.setAttribute('hidden',''); div.innerHTML = `<div class="panel"><h2>Inventory / Stash</h2><button id="close-inventory">Close</button><div id="inv-content"></div></div>`;
    document.body.appendChild(div);
    $('#close-inventory').addEventListener('click', ()=> closeModal(id));
  }
}
export function renderInventory(state){
  const box = document.getElementById('inv-content');
  if (box) box.textContent = JSON.stringify(state?.player?.inv || {}, null, 2);
}

export function setupShopPanel(){
  const id = 'panel-shop';
  if (!document.getElementById(id)){
    const div = document.createElement('div');
    div.id = id; div.setAttribute('hidden',''); div.innerHTML = `<div class="panel"><h2>Shop</h2><button id="close-shop">Close</button><div id="shop-content">Coming soon</div></div>`;
    document.body.appendChild(div);
    $('#close-shop').addEventListener('click', ()=> closeModal(id));
  }
}
export function renderShop(state){ /* minimal */ }

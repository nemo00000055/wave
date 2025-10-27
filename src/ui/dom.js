export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export function openModal(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.removeAttribute('hidden');
  el.ariaHidden = "false";
  el.focus?.();
}
export function closeModal(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('hidden', '');
  el.ariaHidden = "true";
}

const API_BASE_URL = 'https://api.frontendexpert.io/api/fe/testimonials';
const testimonialsList = document.querySelector('#testimonial-container')

testimonialsList.addEventListener('scroll', scrollHandler)

function scrollHandler() {
    if(testimonialsList.scrollTop + (1.1 * testimonialsList.clientHeight) > testimonialsList.scrollHeight) {
        tryUpdate()  
    }
}

let inProgress = false
let hasMore = true
let lastId = null
async function tryUpdate() {
    if(!hasMore) {
        testimonialsList.removeEventListener('scroll', scrollHandler)
        return;
    }
    if(inProgress) return;
    inProgress = true
    const url = `${API_BASE_URL}?limit=5` + (lastId ? `&after=${lastId}` : '')
    const res = await fetch(url)
    const data = await res.json()
    hasMore = data.hasNext
    lastId = data.testimonials[data.testimonials.length - 1].id
    appendTestimonials(data.testimonials)
    inProgress = false
    if(!hasMore) {
        testimonialsList.removeEventListener('scroll', scrollHandler)
    }
}
tryUpdate()

function appendTestimonials(testimonials) {
  const frag = document.createDocumentFragment()
  for(let t of testimonials) {
    const elem = document.createElement('p')
    elem.setAttribute('class', 'testimonial')
    elem.textContent = t.message
    frag.append(elem)
  }
  testimonialsList.append(frag)
}



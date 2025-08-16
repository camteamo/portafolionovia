let photos = [];
let totalSize = 0;
let loadingPhotos = 0;

const uploadZone = document.getElementById('uploadZone');
const photoInput = document.getElementById('photoInput');

uploadZone.addEventListener('click', () => photoInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(Array.from(e.dataTransfer.files));
});

photoInput.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files));
    e.target.value = '';
});

function handleFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    loadingPhotos = imageFiles.length;
    updateLoadingBar(0);

    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photo = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: file.name,
                size: file.size
            };

            photos.push(photo);
            totalSize += file.size;

            setTimeout(() => {
                addPhotoToGallery(photo);
                updateStats();
                updateLoadingBar(((index + 1) / imageFiles.length) * 100);

                if (index === imageFiles.length - 1) {
                    setTimeout(() => {
                        document.getElementById('loadingText').textContent = '';
                        updateLoadingBar(0);
                    }, 500);
                }
            }, index * 200);
        };
        reader.readAsDataURL(file);
    });
}

function addPhotoToGallery(photo) {
    const gallery = document.getElementById('gallery');
    const emptyState = document.getElementById('emptyState');

    emptyState.style.display = 'none';

    const photoElement = document.createElement('div');
    photoElement.className = 'photo-item group cursor-pointer';
    photoElement.innerHTML = `
        <div class="relative bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500">
            <div class="aspect-w-4 aspect-h-3 bg-gray-100">
                <img src="${photo.src}" alt="${photo.name}"
                     class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                     onclick="openModal('${photo.src}', '${photo.name}')">
            </div>
            <div class="absolute inset-0 photo-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div class="p-4 w-full">
                    <div class="flex justify-between items-center">
                        <p class="text-white text-sm font-medium truncate">${photo.name}</p>
                        <button onclick="removePhoto('${photo.id}')" class="text-white hover:text-red-300 transition-colors ml-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    photoElement.dataset.photoId = photo.id;

    gallery.appendChild(photoElement);
}

function removePhoto(photoId) {
    const photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    photos = photos.filter(p => p.id != photoId);
    totalSize -= photo.size;

    const photoElement = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (photoElement) {
        photoElement.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => photoElement.remove(), 300);
    }

    updateStats();

    if (photos.length === 0) {
        setTimeout(() => {
            document.getElementById('emptyState').style.display = 'block';
        }, 300);
    }
}

function clearGallery() {
    if (photos.length === 0) return;

    if (confirm('¿Está segura de que desea eliminar todas las imágenes?')) {
        photos = [];
        totalSize = 0;
        document.getElementById('gallery').innerHTML = '';
        document.getElementById('emptyState').style.display = 'block';
        updateStats();
    }
}

function updateStats() {
    document.getElementById('photoCount').textContent = photos.length;
    document.getElementById('totalSize').textContent = (totalSize / (1024 * 1024)).toFixed(1);
}

function updateLoadingBar(percentage) {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');

    loadingBar.style.width = percentage + '%';

    if (percentage > 0 && percentage < 100) {
        loadingText.textContent = `Cargando imágenes... ${Math.round(percentage)}%`;
    } else if (percentage === 100) {
        loadingText.textContent = 'Carga completada';
    }
}

function openModal(src, name) {
    document.getElementById('modalImage').src = src;
    document.getElementById('modalCaption').textContent = name;
    document.getElementById('photoModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('photoModal').classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.getElementById('photoModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const squares = document.querySelectorAll('.scroll-square');

    squares.forEach((square, index) => {
        const speed = (index + 1) * 0.1;
        const rotation = scrollY * speed * 0.1;
        const translateY = scrollY * speed;

        square.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
    });
});

document.addEventListener('mousemove', (e) => {
    const squares = document.querySelectorAll('.scroll-square');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    squares.forEach((square, index) => {
        const intensity = (index + 1) * 2;
        const moveX = (mouseX - 0.5) * intensity;
        const moveY = (mouseY - 0.5) * intensity;

        const currentTransform = square.style.transform || '';
        const scrollTransform = currentTransform.includes('translateY') ? currentTransform : '';

        square.style.transform = `${scrollTransform} translate(${moveX}px, ${moveY}px)`;
    });
});

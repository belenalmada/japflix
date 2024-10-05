document.addEventListener('DOMContentLoaded', function() {
    const botonBuscar = document.getElementById("btnBuscar");
    const inputBuscar = document.getElementById('inputBuscar');
    const listado = document.getElementById("lista");
    const body = document.body;

    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => {
            if (!response.ok) throw new Error("Error al fetchear el JSON");
            return response.json();
        })
        .then(data => {
            botonBuscar.addEventListener('click', () => buscarPeliculas(data));
        })
        .catch(error => console.error("Error:", error));

    function buscarPeliculas(data) {
        const busqueda = inputBuscar.value.toLowerCase().trim();
        listado.innerHTML = "";

        if (busqueda) {
            const pelisFiltradas = data.filter(movie => movie.title.toLowerCase().includes(busqueda));
            if (pelisFiltradas.length > 0) {
                pelisFiltradas.forEach(movie => agregarPelicula(movie));
            } else {
                listado.innerHTML = '<li class="list-group-item text-white bg-dark">No se encontraron resultados.</li>';
            }
        } else {
            listado.innerHTML = '<li class="list-group-item text-white bg-dark">Debe ingresar un texto para comenzar la búsqueda.</li>';
        }
        inputBuscar.value = "";
    }

    function agregarPelicula(movie) {
        const li = document.createElement('li');
        li.className = 'list-group-item text-white bg-dark';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="mb-0">${movie.title}</h4>
                <div class="text-end">${estrellas(movie.vote_average)}</div>
            </div>
            <span class="tagline">${movie.tagline}</span>
        `;

        li.addEventListener('click', () => mostrarOffcanvas(movie));
        listado.appendChild(li);
    }

    function estrellas(numero) {
        let estrellasHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(numero / 2)) {
                estrellasHTML += '<span class="fa fa-star checked"></span>';
            } else {
                estrellasHTML += '<span class="fa fa-star"></span>';
            }
        }
        return estrellasHTML;
    }

    function mostrarOffcanvas(movie) {
        const anio = new Date(movie.release_date).getFullYear();
        const generos = movie.genres.map(genre => genre.name).join(" - ");
        const offcanvasId = 'offcanvasTop_' + movie.id;

        const offcanvasHTML = `
            <div class="offcanvas offcanvas-top" tabindex="-1" id="${offcanvasId}" aria-labelledby="offcanvasTopLabel">
                <div class="offcanvas-header">
                    <h5 id="offcanvasTopLabel">${movie.title}</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body mb-0">
                    <p>${movie.overview}</p>
                    <hr>
                    <p class="generos mb-0">${generos}</p>   
                </div>
                <div class="dropdown d-flex justify-content-between align-items-center ms-auto">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Más detalle
                    </button>
                    <ul class="dropdown-menu">
                        <li><p class="dropdown-item">Year: ${anio}</p></li>
                        <li><p class="dropdown-item">Runtime: ${movie.runtime} min</p></li>
                        <li><p class="dropdown-item">Budget: $${movie.budget}</p></li>
                        <li><p class="dropdown-item">Revenue: $${movie.revenue}</p></li>
                    </ul>
                </div>
            </div>`;

        const existingOffcanvas = document.getElementById(offcanvasId);
        if (existingOffcanvas) existingOffcanvas.remove();

        body.insertAdjacentHTML('beforeend', offcanvasHTML);
        
        const offcanvas = new bootstrap.Offcanvas(document.getElementById(offcanvasId));
        offcanvas.show();
        
        document.getElementById(offcanvasId).addEventListener('hidden.bs.offcanvas', function() {
            this.remove();
        });
    }
});

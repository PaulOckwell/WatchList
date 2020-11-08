// film Class: Represents a film
class Film {
	constructor(title, year, id) {
		this.title = title;
		this.year = year;
		this.id = id;
	}
}

// UI Class: Handle UI Tasks
class UI {
	static displayMovie() {
		const movie = Store.getMovie();

		movie.forEach((film) => UI.addFilmToList(film));
	}

	static addFilmToList(film) {
		const list = document.querySelector('#film-list');
		const row = document.createElement('tr');

		row.innerHTML = `
		<td>${film.title}</td>
		<td>${film.year}</td>
		<td>${film.id}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
	  `;

		list.appendChild(row);
	}

	static deleteFilm(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#film-form');
		container.insertBefore(div, form);

		// Remove Alert in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#year').value = '';
		document.querySelector('#id').value = '';
	}
}

// Store Class: Handles Storage
class Store {
	static getMovie() {
		let movie;
		if (localStorage.getItem('movie') === null) {
			movie = [];
		} else {
			movie = JSON.parse(localStorage.getItem('movie'));
		}

		return movie;
	}

	static addFilm(film) {
		const movie = Store.getMovie();
		movie.push(film);
		localStorage.setItem('movie', JSON.stringify(movie));
	}

	static removeFilm(id) {
		const movie = Store.getMovie();

		movie.forEach((film, index) => {
			if (film.id === id) {
				movie.splice(index, 1);
			}
		});

		localStorage.setItem('movie', JSON.stringify(movie));
	}
}

// Event: Display movie
document.addEventListener('DOMContentLoaded', UI.displayMovie);

// Event: Add a film
document.querySelector('#film-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();
	const title = document.querySelector('#title').value;
	const year = document.querySelector('#year').value;
	const id = document.querySelector('#id').value;

	// Validate
	if (title === '' || year === '' || id === '') {
		UI.showAlert('Please fill in all fields', 'danger');
	} else {
		const film = new Film(title, year, id);
		UI.addFilmToList(film);
		Store.addFilm(film);
		UI.showAlert('Film Added', 'success');
		UI.clearFields();
	}
});

// Event: Remove a film
document.querySelector('#film-list').addEventListener('click', (e) => {
	UI.deleteFilm(e.target);
	Store.removeFilm(e.target.parentElement.previousElementSibling.textContent);
	UI.showAlert('Film Removed', 'warning');
});

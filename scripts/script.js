const featuredProjectIds = [
    949162550,
    1041645177,
    948182726
];

async function loadProjects() {
    const container = document.getElementById("spotligthcards");

    if (!container) {
        return;
    }

    container.innerHTML = "<p class='loading-projects'>Carregando projetos...</p>";

    try {
        const requests = featuredProjectIds.map(id =>
            fetch(`https://api.github.com/repositories/${id}`).then(response => {
                if (!response.ok) {
                    throw new Error(`Projeto ${id} nao encontrado`);
                }

                return response.json();
            })
        );

        const repos = await Promise.all(requests);

        container.innerHTML = repos.map(repo => `
            <article class="projectcard">
                <h2>${repo.name}</h2>
                <p>
                    ${repo.description || "Sem descricao cadastrada no GitHub"}
                </p>
                <span class="language">
                    ${repo.language || "Sem linguagem"}
                </span>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    Ver no GitHub
                </a>
            </article>
        `).join("");
    } catch (error) {
        container.innerHTML = `
            <p class="loading-projects">
                Nao consegui carregar os projetos agora.
            </p>
        `;
        console.error(error);
    }
}

loadProjects();

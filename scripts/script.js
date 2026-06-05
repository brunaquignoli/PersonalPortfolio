const featuredProjectIds = [
    949162550,
    1041645177,
    984383729
];

const allProjectIds = [
    ...featuredProjectIds,
    1193233078,
    987980526,
    985950450
];

function formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(date));
}

function renderProjects(container, repos) {
    container.innerHTML = repos.map(repo => `
        <article class="projectcard">
            <div class="projectcard-header">
            </div>

            <h2>${repo.name}</h2>
            <p>
                ${repo.description || "Sem descricao cadastrada no GitHub"}
            </p>
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    Ver no GitHub
                </a>
        </article>
    `).join("");
}

async function fetchProjects(projectIds) {
    const requests = projectIds.map(id =>
        fetch(`https://api.github.com/repositories/${id}`).then(response => {
            if (!response.ok) {
                throw new Error(`Projeto ${id} nao encontrado`);
            }

            return response.json();
        })
    );

    return Promise.all(requests);
}

async function loadProjects() {
    const projectSections = [
        {
            container: document.getElementById("spotligthcards"),
            projectIds: featuredProjectIds
        },
        {
            container: document.getElementById("allprojects"),
            projectIds: allProjectIds
        }
    ].filter(section => section.container);

    if (!projectSections.length) {
        return;
    }

    projectSections.forEach(section => {
        section.container.innerHTML = "<p class='loading-projects'> Peraii ainda ta carregando projetos... </p>";
    });

    projectSections.forEach(async section => {
        try {
            const repos = await fetchProjects(section.projectIds);

            renderProjects(section.container, repos);
        } catch (error) {
            section.container.innerHTML = `
                <p class="loading-projects">
                    Nao consegui carregar os projetos agora.
                </p>
            `;

            console.error(error);
        }
    });
}

loadProjects();

// <span class="language">
//     ${repo.language || "Sem linguagem"}
// </span>
// <span class="project-stars">
//     ${repo.stargazers_count} stars
// </span>
//                 <div class="projectcard-footer">
//     <span>Atualizado em ${formatDate(repo.updated_at)}</span>
//     <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
//         Ver no GitHub
//     </a>
// </div>
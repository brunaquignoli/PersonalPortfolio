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

const fallbackProjects = {
    949162550: {
        name: "SiteBiblioteca",
        html_url: "https://github.com/brunaquignoli/SiteBiblioteca",
        description: "Site de um sistema de gerenciamento de livros, utilizando Java, HTML, CSS e JavaScript!"
    },
    1041645177: {
        name: "brunaquignoli",
        html_url: "https://github.com/brunaquignoli/brunaquignoli",
        description: "Conheça mais sobre mim!"
    },
    984383729: {
        name: "SearchSeries",
        html_url: "https://github.com/brunaquignoli/SearchSeries",
        description: "Screen Match sem web feito com Java + Spring Boot."
    },
    1193233078: {
        name: "ConsultaProdutos",
        html_url: "https://github.com/brunaquignoli/ConsultaProdutos",
        description: "Projeto web de cadastro e consulta de produtos em Java com JSP, Servlet e JDBC!"
    },
    987980526: {
        name: "SiteBiblioteca",
        html_url: "https://github.com/brunaquignoli/SiteBiblioteca",
        description: "Site de um sistema de gerenciamento de livros, utilizando Java, HTML, CSS e JavaScript!"
    },
    985950450: {
        name: "brunaquignoli",
        html_url: "https://github.com/brunaquignoli/brunaquignoli",
        description: "Conheça mais sobre mim!"
    }
};

const projectCacheKey = "devproject-github-project-cache";

function readProjectCache() {
    try {
        return JSON.parse(localStorage.getItem(projectCacheKey) || "{}");
    } catch {
        return {};
    }
}

function writeProjectCache(cache) {
    try {
        localStorage.setItem(projectCacheKey, JSON.stringify(cache));
    } catch {
        // Ignora erros de armazenamento e continua com a rede.
    }
}

function getCachedProject(cache, id) {
    return cache[String(id)] || null;
}

function getFallbackProject(id) {
    return fallbackProjects[id] || null;
}

function formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(date));
}

function renderProjects(container, repos) {
    const uniqueRepos = repos.filter((repo, index, allRepos) =>
        index === allRepos.findIndex(otherRepo => otherRepo.html_url === repo.html_url)
    );

    container.innerHTML = uniqueRepos.map(repo => `
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
    const cache = readProjectCache();
    const requests = projectIds.map(async id => {
        const cachedProject = getCachedProject(cache, id);
        const fallbackProject = getFallbackProject(id);

        try {
            const response = await fetch(`https://api.github.com/repositories/${id}`);

            if (!response.ok) {
                throw new Error(`Projeto ${id} nao encontrado`);
            }

            const repo = await response.json();
            cache[String(id)] = repo;
            return repo;
        } catch (error) {
            if (cachedProject) {
                return cachedProject;
            }

            if (fallbackProject) {
                return fallbackProject;
            }

            throw error;
        }
    });

    const settledProjects = await Promise.allSettled(requests);
    const repos = settledProjects
        .filter(result => result.status === "fulfilled" && result.value)
        .map(result => result.value);

    writeProjectCache(cache);
    return repos;
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

            if (repos.length) {
                renderProjects(section.container, repos);
                return;
            }

            section.container.innerHTML = `
                <p class="loading-projects">
                    Nao consegui carregar os projetos agora.
                </p>
            `;
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
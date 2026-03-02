const ldap = require('ldapjs');

// USE 'exports.loginAD' para que o server consiga enxergar a função
exports.loginAD = async (req, res) => {
    const { usuario, senha } = req.body;

    // Configurações do seu AD Local
    const AD_URL = 'ldap://10.100.70.5'; // Troque pelo IP do seu servidor
    const AD_DOMAIN = '@aprogressiva.net'; 

    const client = ldap.createClient({ url: AD_URL });

    client.bind(usuario + AD_DOMAIN, senha, (err) => {
        if (err) {
            client.unbind();
            return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }
        
        // Define a sessão
        req.session.loggedUser = usuario;
        
        client.unbind();
        return res.json({ sucesso: true });
    });
};
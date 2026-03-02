const express = require('express');
const cors = require('cors');
const path = require('path'); 
const session = require('express-session');

// IMPORTAR OS ROUTES E CONTROLLERS
const EstoqueRoutes = require('./Routes/EstoqueRoutes');
const authController = require('./Controller/AuthController'); 

const app = express();

// CONFIGURAR MIDDLEWARES BÁSICOS
app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'agileconnect-secret-key',
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 20 * 60 * 1000 }  // 20 MINUTOS
}));

const verificarSessao = (req, res, next) => {
    if (req.session && req.session.loggedUser) {
        return next(); 
    } else {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ erro: "Sessão expirada." });
        }
        res.redirect('/'); 
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'login.html'));
});

app.get('/index.html', verificarSessao, (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'gerenciador.html'));
});


app.post('/api/login', authController.loginAD);
app.use('/api/estacoes', verificarSessao, EstoqueRoutes);
app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.use(express.static(path.join(__dirname, 'View')));

const PORT = 1337;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
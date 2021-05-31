import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import About from './components/About';
import Menubar from './components/Menubar';
import Home from './components/Home';
import { Container } from 'semantic-ui-react';
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from "./context/auth";
import CreatePost from './components/CreatePost';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Container>
                    <Menubar />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/createpost" component={CreatePost} />
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;

import './App.css';
import CommentForm from './components/CommentForm';

function App() {
  return (
      <div className="App">
          <h1>SPA Комментарии</h1>
          <CommentForm/>
          <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
              rel="stylesheet"
          />
      </div>
  );
}

export default App;

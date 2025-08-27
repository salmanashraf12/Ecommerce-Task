import { useAuth } from "./context/AuthContext";
function App() {
   const { admin } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {admin ? `Welcome, ${admin.username}` : "Welcome to the E-commerce Dashboard"}
      </h1>
      <p className="mt-2 text-gray-600">
        Use the navigation above to manage Products and Categories.
      </p>
    </div>
  );
}



export default App;

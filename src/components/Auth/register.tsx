import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import bgimage from "@src/assets/bgimage.jpg"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!")
      return
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", formData)
      alert("Registration successful! Please login.")
      navigate("/login")
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Registration failed!")
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 sm:p-10 relative"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 text-white">
        <h2 className="text-2xl font-bold text-red-400">Gym Trainer</h2>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-red-500">
            Home
          </Link>
          <Link to="/login" className="hover:text-red-500">
            Login
          </Link>
        </div>
      </nav>
      <div className="bg-white/20 p-8 rounded-lg shadow-lg w-full max-w-sm backdrop-blur-md mt-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "email", type: "email" },
            { name: "password", type: "password" },
            { name: "password2", type: "password" },
            { name: "first_name", type: "text" },
            { name: "last_name", type: "text" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-1">
                {field.name.replace("_", " ").toUpperCase()}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 bg-white/30 text-white placeholder-gray-200"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#003465] text-white py-2 rounded hover:bg-blue-800 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-white">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register


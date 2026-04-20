import { Book, Code, Palette, Calculator, Microscope, Globe, Music } from 'lucide-react'

export default function DCourse() {
    const courses = [
        // Row 1
        { name: "Mathematics", icon: <Calculator className="w-6 h-6" /> },
        { name: "Computer Science", icon: <Code className="w-6 h-6" /> },
        { name: "Art & Design", icon: <Palette className="w-6 h-6" /> },
        { name: "Literature", icon: <Book className="w-6 h-6" /> },
        { name: "Biology", icon: <Microscope className="w-6 h-6" /> },
        { name: "Geography", icon: <Globe className="w-6 h-6" /> },
        { name: "Music", icon: <Music className="w-6 h-6" /> },
        // Row 2
        { name: "Mathematics", icon: <Calculator className="w-6 h-6" /> },
        { name: "Computer Science", icon: <Code className="w-6 h-6" /> },
        { name: "Art & Design", icon: <Palette className="w-6 h-6" /> },
        { name: "Literature", icon: <Book className="w-6 h-6" /> },
        { name: "Biology", icon: <Microscope className="w-6 h-6" /> },
        { name: "Geography", icon: <Globe className="w-6 h-6" /> },
        { name: "Music", icon: <Music className="w-6 h-6" /> },
        // Row 3
        { name: "Mathematics", icon: <Calculator className="w-6 h-10" /> },
        { name: "Computer Science", icon: <Code className="w-6 h-6" /> },
        { name: "Art & Design", icon: <Palette className="w-6 h-6" /> },
        { name: "Literature", icon: <Book className="w-6 h-6" /> },
        { name: "Biology", icon: <Microscope className="w-6 h-6" /> },
        { name: "Geography", icon: <Globe className="w-6 h-6" /> },
        // { name: "Music", icon: <Music className="w-6 h-6" /> },
    ]

    return (
        <div className="mt-4 ">
            <h1 className="text-2xl  font-bold mb-2 mt-4 text-center">Course Catagory</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 border rounded-md bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="mb-2 text-primary">{course.icon}</div>
                        <span className="text-sm font-medium text-gray-700 text-center">{course.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}


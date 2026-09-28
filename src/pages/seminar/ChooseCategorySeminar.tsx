import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ChooseCategorySeminar = () => {
    const navigate = useNavigate();
    const listCategpry = [
        {
            category: "Single",
            price: 50000
        },
        {
            category: "Bundling (3)",
            price: 135000
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>("");


    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);

    }

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    const handleNext = () => {
        if (selectedCategory === "Single") {
            navigate('/seminar/single-register');
        } else if (selectedCategory === "Bundling (3)") {
            navigate('/seminar/bundling-register');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
            <div
                className="bg-white shadow-lg rounded-xl p-8 w-100"
            >
                <div className="flex justify-center mb-8">
                    <img
                        src="/logo_dinacom.png"
                        alt="logo"
                        className="w-48 object-contain"
                    />
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold text-center mb-1">
                        Choose Seminar Category
                    </h2>
                    <p className="text-center text-gray-600">
                        Please select the seminar category you wish to attend.
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex flex-col space-y-4">
                        {listCategpry.map((category) => (
                            <div key={category.category} onClick={() => {
                                handleSelectCategory(category.category);
                            }} className={`flex justify-center items-center cursor-pointer border rounded-lg p-4 hover:bg-gray-100 ${selectedCategory === category.category ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                                <p>{category.category} - {formatRupiah(category.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-[#FF4800] text-white py-2 px-4 rounded hover:bg-[#e04300] disabled:bg-gray-400"
                    disabled={!selectedCategory}
                >
                    Next
                </button>






                {/* Login Button */}
            </div>
        </div>
    )
}

export default ChooseCategorySeminar
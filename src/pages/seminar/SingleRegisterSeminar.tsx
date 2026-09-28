import React, { useState } from 'react'
import LoadingModal from '../../components/LoadingModal';
import * as Yup from 'yup';
import { useSeminarActions } from '../../hooks/useSeminarActions';
import { useNavigate } from 'react-router-dom';



const SingleRegisterSeminar = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        institution: '',
        paymentProof: null as File | null,
    });

    const navigate = useNavigate();

    const { registerSeminar, loading, error, success, reset } = useSeminarActions();

    const FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        institution: Yup.string().required('Institution is required'),
        paymentProof: Yup.mixed().required('Payment proof is required').test('fileSize', 'File too large', value => {
            if (!value) return true;
            const file = value as File;
            return file && file.size <= FILE_SIZE;
        }).test('fileFormat', 'Only PNG, JPEG, and JPG formats are supported', value => {
            if (!value) return true;
            const file = value as File;
            return file && SUPPORTED_FORMATS.includes(file.type);
        }),
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value,  } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm({
                ...form,
                paymentProof: e.target.files[0],
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            validationSchema.validateSync(form, { abortEarly: false });
            setErrors({});
            const formData = new FormData();
            formData.append('category', 'individual');
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('institution', form.institution);
            if (form.paymentProof) {
                formData.append('payment_proof', form.paymentProof);
            }
            registerSeminar(formData);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    };


    return (
        <div className="min-h-screen bg-[#F5F5F5] items-center justify-center p-4 py-8">
            <div className="max-w-2xl w-full flex flex-col gap-4 mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Card */}
                <div className="bg-white rounded-2xl p-8">
                    {/* Header di dalam kotak */}
                    <div className="text-center mb-8">
                        {/* Logo DINACOM SVG */}
                        <div className="flex justify-center mb-4">
                            <img
                                src="/logo_dinacom.png"
                                alt="logo"
                                className="w-52 object-contain"
                            />
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Seminar Registration Form
                        </h2>
                    </div>

                    
                        {/* Name */}
                        <div className='mb-6'>
                            <label className="block text-gray-700 mb-2 font-medium">
                                Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Eka Winando"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="winandoeka@gmail.com"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Phone Number
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="085799999999"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Education Level */}

                        {/* Education Institution */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                                Education Institution
                            </label>
                            <input
                                name="institution"
                                value={form.institution}
                                onChange={handleChange}
                                placeholder="Type here"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                            />
                            {errors.institution && (
                                <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                </div>
                
                <div className="bg-white rounded-2xl p-8">
                    <div className="text-center mb-8">
                        {/* Logo DINACOM SVG */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Payment
                        </h2>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                        <div className="">
                            <h5 className="text-[#FF4800] font-bold text-xl">
                                Yanuar K.J.
                            </h5>
                            <p className="text-gray-600 text-sm">SeaBank 901022097995</p>
                        </div>
                        <div className="">
                            <h5 className="text-[#FF4800] font-bold text-xl">
                                Total:
                            </h5>
                            <p className="text-gray-800 text-lg">
                                Rp 50.000
                            </p>
                        </div>
                    </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Payment's Proof
                            <span className="font-normal text-sm text-gray-500 ml-2">
                                Max size 2MB, PNG/JPG/JPEG
                            </span>
                        </label>
                        <input
                            type="file"
                            name="paymentProof"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400 text-sm text-gray-600"
                        />
                        {errors.paymentProof && (
                            <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#E85002] hover:bg-[#d14802] text-white font-semibold py-4 px-6 rounded-lg transition-colors mt-8"
                        >
                        Submit
                    </button>
                </div>
                </form>

            </div>
            <LoadingModal
                isOpen={loading || success || !!error}
                status={loading ? "loading" : success ? "success" : "error"}
                loadingText="Saving your registration..."
                successText="Registration saved successfully!"
                errorText={error || "Failed to save registration. Please try again."}
                onClose={() => {
                    if (success) {
                        navigate("/seminar/success-register");
                        localStorage.setItem('seminarRegistered', 'true');
                    }
                    reset()
                }}
                showCloseButton={true}
                autoCloseDuration={ success ? 1000 : 3000 }
            />
        </div>
    )
}

export default SingleRegisterSeminar
import React, { useState } from 'react'
import * as Yup from 'yup'
import { useSeminarActions } from '../../hooks/useSeminarActions'
import LoadingModal from '../../components/LoadingModal'
import { useNavigate } from 'react-router-dom'

type Member = {
    name: string
    email: string
    phone: string
    institution: string
}

const BundlingRegisterSeminar = () => {
    const number_of_bundling = 3

    const navigate = useNavigate();

    const [form, setForm] = useState<{
        members: Member[]
        paymentProof: File | null
    }>({
        members: Array.from({ length: number_of_bundling }, () => ({
            name: '',
            email: '',
            phone: '',
            institution: '',
        })),
        paymentProof: null,
    })

    const { registerSeminar, loading, reset, error, success } = useSeminarActions()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const FILE_SIZE = 2 * 1024 * 1024
    const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg']

    const validationSchema = Yup.object({
        members: Yup.array()
            .of(
                Yup.object({
                    name: Yup.string().required('Name is required'),
                    email: Yup.string().email('Invalid email').required('Email is required'),
                    phone: Yup.string().required('Phone number is required'),
                    institution: Yup.string().required('Education institution is required'),
                })
            )
            .required(),
        paymentProof: Yup.mixed()
            .required('Payment proof is required')
            .test('fileSize', 'File too large (max 2MB)', value =>
                value ? (value as File).size <= FILE_SIZE : true
            )
            .test('fileFormat', 'Only PNG, JPG, JPEG allowed', value =>
                value ? SUPPORTED_FORMATS.includes((value as File).type) : true
            ),
    })

    const handleMemberChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target
        const members = [...form.members]
        members[index] = { ...members[index], [name]: value }
        setForm({ ...form, members })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setForm({ ...form, paymentProof: e.target.files[0] })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        try {
            validationSchema.validateSync(form, { abortEarly: false })
            setErrors({})
            // Submit the form here
            const formData = new FormData()
            formData.append('category', 'group')
            formData.append('number_of_members', number_of_bundling.toString())
            form.members.forEach((member, index) => {
                formData.append(`members[${index}][name]`, member.name)
                formData.append(`members[${index}][email]`, member.email)
                formData.append(`members[${index}][phone]`, member.phone)
                formData.append(`members[${index}][institution]`, member.institution)
            })
            if (form.paymentProof) {
                formData.append('payment_proof', form.paymentProof)
            }
            registerSeminar(formData)
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: Record<string, string> = {}
                err.inner.forEach(error => {
                    if (error.path) newErrors[error.path] = error.message
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto flex flex-col gap-4"
            >
                {form.members.map((member, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8">
                        {index === 0 && (
                            <div className="text-center mb-8">
                                <img
                                    src="/logo_dinacom.png"
                                    alt="logo"
                                    className="w-52 mx-auto mb-4"
                                />
                                <h2 className="text-xl font-semibold">
                                    Seminar Registration Form
                                </h2>
                            </div>
                        )}

                        <p className="font-medium mb-4">Participant {index + 1}</p>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Name</label>
                            <input
                                name="name"
                                value={member.name}
                                onChange={e => handleMemberChange(index, e)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                            />
                            {errors[`members[${index}].name`] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[`members[${index}].name`]}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Email */}
                            <div className="mb-4">
                                <label className="block mb-2 font-medium">Email</label>
                                <input
                                    name="email"
                                    value={member.email}
                                    onChange={e => handleMemberChange(index, e)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                                />
                                {errors[`members[${index}].email`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[`members[${index}].email`]}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block mb-2 font-medium">Phone</label>
                                <input
                                    name="phone"
                                    value={member.phone}
                                    onChange={e => handleMemberChange(index, e)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                                />
                                {errors[`members[${index}].phone`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[`members[${index}].phone`]}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Institution */}
                        <div>
                            <label className="block mb-2 font-medium">Institution</label>
                            <input
                                name="institution"
                                value={member.institution}
                                onChange={e => handleMemberChange(index, e)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                            />
                            {errors[`members[${index}].institution`] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[`members[${index}].institution`]}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {/* PAYMENT */}
                <div className="bg-white rounded-2xl p-8">
                    <h2 className="text-xl font-semibold mb-6 text-center">Payment</h2>

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
                                Rp 135.000
                            </p>
                        </div>
                    </div>

                    <label className="block mb-2 font-medium">Payment Proof
                        <span className="font-normal text-sm text-gray-500 ml-2">
                            Max size 2MB, PNG/JPG/JPEG
                        </span>
                    </label>
                    <input type="file" onChange={handleFileChange} className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400 text-sm text-gray-600' accept="image/*" />


                    {errors.paymentProof && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.paymentProof}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#E85002] text-white py-4 rounded-lg mt-8"
                    >
                        Submit
                    </button>
                </div>
            </form>

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

export default BundlingRegisterSeminar

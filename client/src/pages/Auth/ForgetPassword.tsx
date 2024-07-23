// ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { authService } from "../../api/authService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitResetPassword = async (data: any) => {
        console.log(data);
        const response = await authService.forgotPassword(data);
        console.log(response);
        if (response.statusCode === 200) {
            navigate("/auth/login");
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="hero bg-white min-h-screen">
            <div className="hero-content w-1/2 flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl text-secondary font-bold">Forgot Password?</h1>
                    <p className="py-6 text-basecolor">Enter your email to receive a password reset link.</p>
                </div>
                <div className="card bg-white border-4 border-secondary w-full max-w-sm shrink-0 shadow-2xl">
                    <form onSubmit={handleSubmit(submitResetPassword)} className="card-body">
                        <div className="form-control">
                            <label htmlFor="useremail" className="label">
                                <span className="label-text text-black text-lg">Email</span>
                            </label>
                            <input
                                {...register("userEmail", { required: true })}
                                type="email"
                                id="useremail"
                                placeholder="email"
                                className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
                            />
                            {errors.email && <p className="text-error">Email is required.</p>}
                        </div>

                        <div className="form-control">
                            <label htmlFor="usersecret" className="label">
                                <span className="label-text text-black text-lg">Secret</span>
                            </label>
                            <input
                                {...register("userSecret", { required: true })}
                                type="string"
                                id="usersecret"
                                placeholder="User Secret"
                                className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
                            />
                            {errors.usersecret && <p className="text-error">Secret is required.</p>}
                        </div>

                        <div className="form-control">
                            <label htmlFor="useremail" className="label">
                                <span className="label-text text-black text-lg">New password</span>
                            </label>
                            <input
                                {...register("newPassword", { required: true })}
                                type="password"
                                id="newpassword"
                                placeholder="Password"
                                className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
                            />
                            {errors.password && <p className="text-error">New password is required.</p>}
                        </div>
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary text-white text-lg">
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
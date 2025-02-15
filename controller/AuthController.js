import AuthService from '../services/AuthService.js';

const AuthController = {
   async register(req, res) {
      try {
         const { token, user } = await AuthService.register(req.body);
         res.status(201).json({ message: "Đăng ký thành công!", token, user });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   },

   async login(req, res) {
      try {
         const { email, password } = req.body;
         const { token, user } = await AuthService.login(email, password);
         res.status(200).json({ message: "Đăng nhập thành công!", token, user });
      } catch (error) {
         res.status(401).json({ error: error.message });
      }
   },

   async googleCallback(req, res) {
      try {
         const user = await AuthService.googleLogin(req.user);
         res.status(200).json(user);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },

   async githubCallback(req, res) {
      try {
         const user = await AuthService.googleLogin(req.user);
         res.status(200).json(user);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }
};

export default AuthController;
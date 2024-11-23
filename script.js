    // EmailJS yapılandırması
    (function() {
        emailjs.init({
            publicKey: "URhwV9UllfMSdrLX3",  // EmailJS Public Key
        });
    })();

    const registerForm = document.getElementById('registerForm');
    const otpForm = document.getElementById('otpForm');
    const messageDiv = document.getElementById('message');
    const successMessageDiv = document.getElementById('success-message');
    const loginForm = document.getElementById('loginForm');
    const loginMessageDiv = document.getElementById('loginMessage');
    const formContainer = document.getElementById('formContainer');
    const redirectToLogin = document.getElementById('redirectToLogin');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink'); // Sign Up bağlantısı

    let generatedOTP = "";
    let registeredUser = {};

    // Kayıt formu doğrulama ve OTP gönderme
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Formun varsayılan submit davranışını durdur

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        // Basit doğrulamalar
        if (password !== confirmPassword) {
            messageDiv.innerHTML = "Passwords do not match!";
            messageDiv.style.display = "block";
            successMessageDiv.style.display = "none";
        } else if (password.length < 6) {
            messageDiv.innerHTML = "Password must be at least 6 characters long!";
            messageDiv.style.display = "block";
            successMessageDiv.style.display = "none";
        } else {
            // Mevcut kullanıcıları kontrol et
            let users = localStorage.getItem('users');
            if (users) {
                users = JSON.parse(users);  // Önceden kaydedilmiş kullanıcılar varsa onları JSON olarak al
                const emailExists = users.some(user => user.email === email);
                if (emailExists) {
                    messageDiv.innerHTML = "This email is already registered!";
                    messageDiv.style.display = "block";
                    successMessageDiv.style.display = "none";
                    return;  // Kullanıcı e-posta adresi mevcutsa işlemi durdur
                }
            }

            messageDiv.style.display = "none";
            successMessageDiv.innerHTML = "Registration successful! Enter the OTP sent to your email.";
            successMessageDiv.style.display = "block";

            // OTP oluşturma
            generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

            // EmailJS ile OTP gönderimi
            const templateParams = {
                to_email: email,
                otp_code: generatedOTP
            };

            emailjs.send("service_90e0ko9", "template_zr479cp", templateParams)
            .then(function(response) {
                console.log("OTP Sent!", response.status, response.text);
            }, function(error) {
                console.log("Failed to send OTP.", error);
                messageDiv.innerHTML = "Failed to send OTP. Please try again.";
                messageDiv.style.display = "block";
                successMessageDiv.style.display = "none";
            });

            // Kullanıcı bilgilerini kaydet
            registeredUser = {
                username: username,
                email: email,
                password: password
            };

            // Kayıt formunu gizle, OTP formunu göster
            registerForm.style.display = "none";
            otpForm.style.display = "block";
        }
    });

    // OTP doğrulama
    otpForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const otp = document.getElementById('otp').value;

        if (otp === generatedOTP) {  // OTP doğrulama işlemi
            successMessageDiv.innerHTML = "OTP verified successfully!";
            successMessageDiv.style.display = "block";

            // Kullanıcı bilgilerini JSON formatında localStorage'a kaydet
            saveUserToLocalStorage(registeredUser);

            otpForm.style.display = "none";  // OTP doğrulandığında formu gizle
            alert("You can now log in!");  // Kullanıcıya giriş yapabileceği mesajı
            showLoginForm();  // Giriş formunu göster
        } else {
            messageDiv.innerHTML = "Invalid OTP. Please try again.";
            messageDiv.style.display = "block";
        }
    });

    // localStorage'a kullanıcı bilgilerini kaydetme fonksiyonu
    function saveUserToLocalStorage(user) {
        let users = localStorage.getItem('users');

        if (users) {
            users = JSON.parse(users);  // Önceden kaydedilmiş kullanıcılar varsa onları JSON olarak al
        } else {
            users = [];  // Daha önce kullanıcı kaydedilmemişse boş bir dizi oluştur
        }

        users.push(user);  // Yeni kullanıcıyı ekle
        localStorage.setItem('users', JSON.stringify(users));  // JSON formatında localStorage'a kaydet

        console.log("User data saved to localStorage successfully!");
    }

    // Giriş formu işlemleri
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Formun varsayılan submit davranışını durdur

        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;

        // localStorage'dan kullanıcı verilerini alma
        let users = localStorage.getItem('users');
        if (users) {
            users = JSON.parse(users);
            const userFound = users.find(user => user.email === loginEmail && user.password === loginPassword);

            if (userFound) {
                loginMessageDiv.innerHTML = "Login successful!";
                loginMessageDiv.style.display = "block";
                // Burada kullanıcının giriş işlemi sonrası yönlendirme yapabilirsiniz
            } else {
                loginMessageDiv.innerHTML = "Invalid email or password. Please try again.";
                loginMessageDiv.style.display = "block";
            }
        } else {
            loginMessageDiv.innerHTML = "No users registered. Please register first.";
            loginMessageDiv.style.display = "block";
        }
    });

    // Giriş formunu gösterme fonksiyonu
    function showLoginForm() {
        document.getElementById('loginSection').style.display = 'block';  // Giriş formunu göster
        document.getElementById('registerSection').style.display = 'none';  // Kayıt formunu gizle
    }

    // Giriş bağlantısına tıklama olayı
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();  // Bağlantının varsayılan davranışını durdur
        showLoginForm();  // Giriş formunu göster
    });

    // Kayıt bağlantısına tıklama olayı
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();  // Bağlantının varsayılan davranışını durdur
        document.getElementById('loginSection').style.display = 'none';  // Giriş formunu gizle
        document.getElementById('registerSection').style.display = 'block';  // Kayıt formunu göster
    });
    // Dark Theme Toggle
    const darkThemeToggle = document.getElementById('darkThemeToggle');
    const body = document.body;
    const container = document.getElementById('formContainer');

    // Tema değişimini dinle
    darkThemeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-theme'); // Body'e dark-theme sınıfı ekle veya kaldır
        container.classList.toggle('dark-theme'); // Container'a dark-theme sınıfı ekle veya kaldır
    });

const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body

        if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "A username, valid email, and password of at least 8 characters are required",
      });
    }

    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim().toLowerCase()

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash,
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
        },
    })

    return res.status(201).json({
        message: "User registered successfully!",
        user,
    })
    } catch(error) {
        if( error.code === "P2002") {
            return res.status(409).json({
                message: "Username or email alredy registered"
            })
        }

        console.error('Error registering user:', error)

        return res.status(500).json({
            message: "Failed to register user"
        })
    }
}




async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    // Use the same response for unknown emails and wrong passwords.
    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}


module.exports = { registerUser, loginUser }
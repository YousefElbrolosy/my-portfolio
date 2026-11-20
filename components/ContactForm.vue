<template>
    <form id="contact-form" class="text-sm">
        <div class="flex flex-col">
            <label for="name-input" class="mb-3">_name:</label>
            <input type="text" id="name-input" name="name" :placeholder="name" class="p-2 mb-5 placeholder-slate-600" required>
        </div>
        <div class="flex flex-col">
            <label for="email-input" class="mb-3">_email:</label>
            <input type="email" id="email-input" name="email" :placeholder="email" class="p-2 mb-5 placeholder-slate-600" required>
        </div>
        <div class="flex flex-col">
            <label for="message-input" class="mb-3">_message:</label>
            <textarea id="message-input" name="message" :placeholder="message" class="placeholder-slate-600" required></textarea>
        </div>
        <button id="submit-button" type="submit" class="py-2 px-4" :disabled="submitState === 'sending'">
            {{ submitState === 'sending' ? 'sending...' : 'submit-message' }}
        </button>
        <p v-if="submitState === 'success'" class="mt-3 text-greenfy">message sent successfully</p>
        <p v-if="submitState === 'error'" class="mt-3 text-codeline-link">failed to send message</p>
    </form>
</template>

<script>


export default {
    name: 'ContactForm',
    props: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            submitState: 'idle'
        }
    },
    mounted() {
        document.getElementById("contact-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const form = event.target;
            const name = document.querySelector('input[name="name"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const message = document.querySelector('textarea[name="message"]').value.trim();
            
            if (!name || !email || !message) {
                this.submitState = 'error';
                return;
            }

            this.submitState = 'sending';

            try {
                await this.$mail.send({
                    subject: `Portfolio contact from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    replyTo: email,
                });

                this.submitState = 'success';
                form.reset();
            } catch (error) {
                this.submitState = 'error';
                console.error(error);
            }
        });
    }
}
</script>

<style>

form {
    @apply font-fira_retina text-menu-text
}
input {
    background-color: var(--c-bg-sunken);
    border: 2px solid var(--c-border);
    border-radius: 7px;
    
}
/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--c-text);
  transition: background-color 5000s ease-in-out 0s;
  border: 2px solid var(--c-muted);
}

#message-input {
    background-color: var(--c-bg-sunken);
    border: 2px solid var(--c-border);
    border-radius: 7px;
    resize: none;
    height: 150px;
    padding: 10px;
}

#submit-button {
    @apply font-fira_retina text-fg text-sm;
    background-color: var(--c-border);
    border-radius: 7px;
    margin-top: 20px;
    cursor: pointer;
}

#submit-button:hover {
    background-color: var(--c-surface-hover);
}

input:focus, #message-input:focus {
    outline: none;
    transition: none;
    border: 2px solid var(--c-muted);
    box-shadow: var(--c-ring-soft) 0px 0px 0px 2px;
  }

#contact-form {
    max-width: 370px;
    width: 100%;
}

@media (max-width: 1920px) {
    #contact-form {
        max-width: 320px;
        max-height: 400px;
    }
    #submit-button {
        /* width: 100%; */
        font-size: 12px;
    }
    textarea {
        font-size: 13px;
        max-height: 130px !important;
    }
    input {
        font-size: 13px;
    }
}
</style>
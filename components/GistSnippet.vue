<template>
    <div class="gist mb-5" v-if="dataFetched">
        
        <!-- head info -->
        <div class="flex justify-between my-2">

            <div class="flex">
                <!-- avatar -->
                <img :src="gist.owner.avatar_url" alt="" class="w-8 h-8 rounded-full mr-2">
    
                <!-- username & gist date info -->
                <div class="flex flex-col">
                    <a id="username" :href="'https://github.com/' + gist.owner.login" target="_blank" class="font-fira_bold text-purple-text text-xs pb-1 hover:cursor-pointer">
                        @{{ gist.owner.login }}
                    </a>
                    <p class="font-fira_retina text-xs text-menu-text">Created {{ monthsAgo }} months ago</p>
                </div>
            </div>

            <!-- details and stars -->
            <div class="flex text-menu-text font-fira_retina text-xs justify-self-end lg:mx-2">
                <div class="flex lg:mx-2 hover:cursor-pointer hover:text-fg">
                    <img src="/icons/gist/comments.svg" alt="" class="w-4 h-4 mr-2">
                    <span @click="showComment(gist.id)">details</span>
                </div>
                <div class="hidden lg:flex hover:cursor-pointer hover:text-fg">
                    <img src="/icons/gist/star.svg" alt="" class="w-4 h-4 mx-2">
                    <span class="">stars</span>
                </div>
            </div>
            
        </div>

        <div class="snippet-container">
            <pre><code class="hljs" v-html="highlightedCode"></code></pre>
        </div>
        <div :id="'comment' + gist.id" class="flex hidden justify-between text-menu-text font-fira_retina mt-4 pt-4 border-top">
            <p id="comment" v-if="comment" class="w-5/6">{{ comment }}</p>
            <p v-else class="w-5/6">No comments.</p>
            <img src="/icons/close.svg" alt="" class="hover:cursor-pointer" @click="showComment(gist.id)">
        </div>
    </div>
</template>

<style>
.snippet-container {
    background-color: var(--c-bg-sunken);
    padding: 5px;
    border-radius: 15px;
    border: 1px solid var(--c-border);
    font-size: 12px;
    overflow-y: scroll;
    overflow-x: scroll;
    max-height: 220px;
}

.snippet-container pre {
    margin: 0;
    overflow: hidden;
    width: 100%;
    max-height: 220px;
}

.snippet-container code {
    white-space: pre-wrap;
    max-height: 220px;
    width: max-content;
    overflow: hidden;

}

.snippet-container::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
}

pre code.hljs{
    display:block;
    /* overflow-x:auto; */
    padding:1.5em
}

code.hljs{
    padding:3px 5px
}

#comment {
    font-size: 14px;
}

#username:hover {
    color: var(--c-link);
}

/* #comment {
    
} */

.hljs{color:#85a9ce;background:#011221}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#ff7b72}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#d2a8ff}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#79c0ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#a5d6ff}.hljs-built_in,.hljs-symbol{color:#ffa657}.hljs-code,.hljs-comment,.hljs-formula{color:#8b949e}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#7ee787}.hljs-subst{color:#c9d1d9}.hljs-section{color:#1f6feb;font-weight:700}.hljs-bullet{color:#f2cc60}.hljs-emphasis{color:#c9d1d9;font-style:italic}.hljs-strong{color:#c9d1d9;font-weight:700}.hljs-addition{color:#aff5b4;background-color:#033a16}.hljs-deletion{color:#ffdcd7;background-color:#67060c}

/* GitHub light theme */
[data-theme="light"] .hljs{color:#24292e;background:var(--c-bg-sunken)}[data-theme="light"] .hljs-doctag,[data-theme="light"] .hljs-keyword,[data-theme="light"] .hljs-meta .hljs-keyword,[data-theme="light"] .hljs-template-tag,[data-theme="light"] .hljs-template-variable,[data-theme="light"] .hljs-type,[data-theme="light"] .hljs-variable.language_{color:#d73a49}[data-theme="light"] .hljs-title,[data-theme="light"] .hljs-title.class_,[data-theme="light"] .hljs-title.class_.inherited__,[data-theme="light"] .hljs-title.function_{color:#6f42c1}[data-theme="light"] .hljs-attr,[data-theme="light"] .hljs-attribute,[data-theme="light"] .hljs-literal,[data-theme="light"] .hljs-meta,[data-theme="light"] .hljs-number,[data-theme="light"] .hljs-operator,[data-theme="light"] .hljs-selector-attr,[data-theme="light"] .hljs-selector-class,[data-theme="light"] .hljs-selector-id,[data-theme="light"] .hljs-variable{color:#005cc5}[data-theme="light"] .hljs-meta .hljs-string,[data-theme="light"] .hljs-regexp,[data-theme="light"] .hljs-string{color:#032f62}[data-theme="light"] .hljs-built_in,[data-theme="light"] .hljs-symbol{color:#e36209}[data-theme="light"] .hljs-code,[data-theme="light"] .hljs-comment,[data-theme="light"] .hljs-formula{color:#6a737d}[data-theme="light"] .hljs-name,[data-theme="light"] .hljs-quote,[data-theme="light"] .hljs-selector-pseudo,[data-theme="light"] .hljs-selector-tag{color:#22863a}[data-theme="light"] .hljs-subst,[data-theme="light"] .hljs-emphasis,[data-theme="light"] .hljs-strong{color:#24292e}[data-theme="light"] .hljs-section{color:#005cc5}[data-theme="light"] .hljs-bullet{color:#735c0f}[data-theme="light"] .hljs-addition{color:#22863a;background-color:#f0fff4}[data-theme="light"] .hljs-deletion{color:#b31d28;background-color:#ffeef0}

</style>

<script>
import hljs from 'highlight.js/lib/common';

export default {
    name: 'GistSnippet',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data(){
        return {
            gist: null,
            monthsAgo: null,
            content: null,
            highlightedCode: null,
            language: null,
            dataFetched: false,
            comment: null
        }
    },
    mounted(){
        fetch(`https://api.github.com/gists/${this.id}`)
            .then(response => response.json())
            .then(data => this.setValues(data))
    },
    methods: {
        async setValues(gist) {
            this.gist = gist
            this.monthsAgo = this.setMonths(gist.created_at)
            this.content = this.setSnippet(gist)
            this.language = Object.values(gist.files)[0].language
            this.highlightedCode = hljs.highlightAuto(this.content).value
            this.dataFetched = true
            this.comment = await this.setComments(gist.comments_url)
        },
        setMonths(date) {
            let now = new Date()
            let gistDate = new Date(date)
            let diff = now.getTime() - gistDate.getTime()
            let days = Math.floor(diff / (1000 * 3600 * 24))
            let months = Math.floor(days / 30)
            return months
        },
        setSnippet(gist) {
            return Object.values(gist.files)[0].content
        },
        async setComments(comments_url){
            let response = await fetch(comments_url)
            let data = await response.json()
            try {
                return data[0].body
            } catch {
                console.log(`no comments found on ${comments_url}`)
            }
        },
        showComment(id) {
            let comment = document.getElementById('comment' + id)
            comment.classList.toggle('hidden')
        }
    }
}
</script>
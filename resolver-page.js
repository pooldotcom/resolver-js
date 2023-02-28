import { html, css, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-icon-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-circular-progress@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-dialog@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-button@0/+esm'
import 'https://cdn.jsdelivr.net/npm/@material/mwc-textfield@0/+esm'
import { snack } from 'https://cdn.jsdelivr.net/gh/treeder/web-components@0/tr-snack/tr-snack.js'

import { resolve } from './resolver.js'
// import { resolve } from 'https://cdn.jsdelivr.net/gh/treeder/resolver-js@main/resolver.js'

export class ResolverPage extends LitElement {

    static styles = [
        css`
      `
    ]

    static properties = {
        name: { type: String },
        metadata: { type: Object },
        address: { type: String },
        answer: { type: String },

        fetching: { type: Boolean },
        error: { type: Object },
    }

    constructor() {
        super()
        this.name = ''
        this.metadata = null
        this.address = ''
        this.answer = ''

        this.fetching = false
        this.error = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchData()
    }

    async fetchData() {

    }

    render() {
        if (this.error) {
            return html`Error: ${this.error}`;
        }

        return html`
        <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
    <div>
        <mwc-textfield id="name" label="Domain Name" required @keyup=${this.resolveAddress}>
        </mwc-textfield>
    </div>
    <div>
        ${this.fetching ?
                html`<mwc-circular-progress indeterminate></mwc-circular-progress>` : this.answer != null ?
                    html`<div style="font-size: 110%; font-weight: bold;">${this.answer}</div>`
                    : ''}
    </div>
    </div>
        `
    }
    async resolveAddress(e) {
        // console.log(e.key)
        if (e.key !== 'Enter') {
            return
        }
        this.fetching = true
        let name = this.renderRoot.querySelector("#name").value
        console.log('name', name)
        try {
            this.answer = await resolve(name)
            console.log("answer:", this.answer)
            if (!this.answer) {
                snack("Name not found")
            }
        } catch (err) {
            if (err.message.includes("invalid token ID")) {
                console.log(err.message)
                snack("Name not found")
            } else {
                console.error(err)
                snack(err)
            }
        }
        this.fetching = false

    }

}
customElements.define('resolver-page', ResolverPage)
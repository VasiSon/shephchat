Vue.component('dialogs', {
  	template: `
        <div>
            <div v-if="currentInterlocutorId != -1">
                <h4 class="no-user-select">
                    Ваш диалог с {{currentInterlocutor.nickname}}
                </h4>
                <div class="no-messages" v-if="currentMessages.length == 0">
                    <h5>Сообщения еще не были отправлены!</h5>
                </div>
                <div class="messages" v-else>
                    <div v-for="message in currentMessages" v-bind:class="{ incoming: message.type == 'incoming', outgoing: message.type == 'outgoing' }">
                        <span>
                            {{message.text}}
                            <div class="time"><i class="fa fa-clock-o "></i> {{message.time}}</div>
                        </span>
                    </div>
                </div>
                <form class="send-form">
                    <textarea class="form-control" placeholder="Введите ваше сообщение ..." v-model="message"></textarea>
                    <button class="btn btn-success btn-block" v-on:click.prevent="sendMessage()" v-bind:class="{disabled: !messageValid}"><i class="fa fa-send"></i></button>
                </form>
            </div>
            <div class="no-dialog" v-else>
                <h4 class="no-user-select">
                    Чтобы начать диалог выберите собеседника
                </h4>
            </div>
        </div>
  	`,
  	props: ['users', 'dialogs', 'currentInterlocutorId'],
  	data: function(){
  		return {
  			message: "",
  		}
  	},
  	computed: {
  		currentInterlocutor: function(){
  			return this.users.find(user => user.id == this.currentInterlocutorId);
  		},
  		currentMessages: function(){
  			try {
  				return this.dialogs.find(dialog => dialog.interlocutorId == this.currentInterlocutorId).messages;
  			} catch( error ) {
  				return [];
  			}
  		},
        messageValid: function(){
            return this.message.length > 0;
        }
  	},
    methods: {
        sendMessage: function(){
            if(this.messageValid){
                this.$emit('send-message', this.message);
                this.message = "";
                setTimeout(() => {
                    this.$el.children[0].children[1].scrollTop = this.$el.children[0].children[1].scrollHeight;
                }, 1);
            }

        },
    },
    mounted: function(){
        window.socket.on('received-message', (data) => {
            setTimeout(() => {
                if(data.senderId == this.currentInterlocutorId){
                    this.$el.children[0].children[1].scrollTop = this.$el.children[0].children[1].scrollHeight;
                }
            }, 1);
        });
    }
});

Vue.component('users', {
  	template: `
        <div>
        	<h4 class="no-user-select">Пользователи в сети</h4>
      	  	<ul class="users">
      	  		<li v-for="user in users"
      	  			v-on:click="openDialog(user.id)"
      	  			v-bind:class="{opened: user.id == currentInterlocutorId, closed: user.id != currentInterlocutorId}">
      	  			{{user.nickname}}
                <span class="badge badge-success" v-if="getDialog(user.id).newMessages > 0">+{{getDialog(user.id).newMessages}}</span>
      	  		</li>
      	  	</ul>
        </div>
  	`,
  	props: ['users', 'dialogs', 'currentInterlocutorId'],
  	methods: {
    	openDialog(id){
            //Оповещение родительского компонента(App)
    		this.$emit('open-dialog', id);
    	},
        //Этот метод нужен для вывода кол-ва непрочитанных сообщений
        getDialog(userId){
            //Ищем диалог
            var dialog = this.dialogs.find(dialog => dialog.interlocutorId == userId);
            //Если диалог не найден
            if(dialog == undefined){
                return {
                    newMessages: 0,
                }
            }
            return dialog;
        }
  	}
});

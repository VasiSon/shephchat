Vue.component('select-nickname', {
  	template: `
        <div class="col-4 offset-4 select-nickname">
      	  	<form class="form-inline">
                <div class="form-group mx-sm-3 mb-2">
                    <input type="text" class="form-control" placeholder="Ваш никнейм" v-model="nickname">
                </div>
                <button class="btn btn-primary mb-2" v-on:click.prevent="select()" v-bind:class="{disabled: !nicknameValid}"><i class="fa fa-sign-in"></i></button>
            </form>
        </div>
  	`,
  	data: function(){
  	  	return {
  	  		  nickname: "",
  	  	}
  	},
    computed: {
        //Проверка ввода
        nicknameValid: function(){
            return this.nickname.length >= 1;
        },
    },
  	methods: {
        select: function(){
            if(this.nicknameValid){
                //Порождаем событие selected
                this.$emit('selected', this.nickname);
            }
  		}
    }
});

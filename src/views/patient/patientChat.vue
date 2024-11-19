<template>
  <div >
        <!-- 新增标题 -->
    <div  style="text-align: center;" >
      <h1 >{{this.patient.病案号+"  "+this.patient.姓名+" "+this.patient.科室 }}</h1>
    </div>


      <div class="chat-container">
             <!-- 左侧聊天记录 -->
      <div class="chat-history">
        <el-scrollbar ref="chatHistoryScrollbar" class="chat-history-scroll">
          <div
            v-for="(chat, index) in chatHistory"
            :key="index"
            class="chat-history-item"
            :class="{ selected: selectedChatIndex === index }"
            @click="switchChat(index)"
            ref="chatItem"
          >
            <div class="chat-title">{{ chat.title }}</div>
            <div class="chat-timestamp">{{ formatTime(chat.timestamp) }}</div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 右侧对话区域 -->
      <div class="chatgpt-chat">
          <el-scrollbar ref="messageScrollbar" class="chatgpt-scroll">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['message', message.type]"
            >
              <div class="message-content">
                <div class="avatar">
                  <img :src="message.avatar" alt="avatar" />
                </div>
                <div class="text-wrapper">
                  <div class="text" v-html="message.text"></div>
                  <div class="timestamp">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
            </div>
            <div v-if="loading" class="loading"></div>
          </el-scrollbar>
<!--          输入区域-->
          <div  class="input-container" >
             <el-input
             type="textarea"
              v-model="inputMessage"
                placeholder="Send a message..."
              class="input-box"
               :class="{ 'dark-mode': darkMode }"
              :disabled="loading"
                >
             </el-input>
             <el-button
              type="info"
              @click="sendMessage"
               :disabled="isButtonDisabled"
                  class="send-button"
                     >
                Send
              </el-button>
           </div>

       </div>

      </div>

  </div>
</template>


<script>


import baiduAi128Server from '@/api/baiduAiServer/ApiErnieSpeed128kService';
export default {

      props: {
      patientData: {
        type: Object,
        default: () => ({}),
         required: true, // 如果 Data 是必需的，可以加上 required
      },
     },


  data() {
    return {
      patient:'',
      inputMessage: '',
      messages: [],
      chatHistory: [],
      loading: false,
      darkMode: false,
      selectedChatIndex: 0,
    };
  },


  mounted() {
    this.getEmrData();
    this.switchChat(Number(this.patientData.index));
  },
  methods: {
    switchChat(index) {
          if (this.loading) return;  // 如果正在加载，则不切换聊天
      this.selectedChatIndex = index;
      this.messages = this.chatHistory[index].messages;
      this.$nextTick(() => {
        setTimeout(() => {
          const selectedChatElement = this.$refs.chatItem[index];
          const scrollbar = this.$refs.chatHistoryScrollbar;

          if (selectedChatElement && scrollbar) {
            const offsetTop = selectedChatElement.offsetTop;
            const itemHeight = selectedChatElement.offsetHeight;
            const containerHeight = scrollbar.$el.clientHeight;

            const scrollPosition =
              offsetTop - containerHeight / 2 + itemHeight / 2;
            scrollbar.wrap.scrollTop = scrollPosition;
          }
        }, 50);
      });
    },
    async sendMessage() {
      if (this.inputMessage.trim() === '') return;

      const timestamp = new Date().toLocaleTimeString();

    // 将用户消息立即推送到对话框中
      this.messages.push({
        text: this.inputMessage,
        type: 'user',
        avatar:  require('@/assets/chat.png'),
        timestamp,
      });

        // 滚动条滚动到底部
      this.$nextTick(() => {
        const scrollbar = this.$refs.messageScrollbar.$el.querySelector('.el-scrollbar__wrap');
        scrollbar.scrollTop = scrollbar.scrollHeight;
      });

      this.loading = true;
      this.getGptResponse(this.inputMessage,this.chatHistory[ this.selectedChatIndex ].messages[0].text);
      this.inputMessage = '';
    },

  async   getGptResponse(question,emr){
         const timestamp = new Date().toLocaleTimeString();


         let  canShu=[{"role": "user", "content": emr+' '+question}];
           try {
          const response= await baiduAi128Server.sendRequest(canShu);
           let answer=response.result;
            this.displayGPTMessage(answer, timestamp);
        } catch (error) {
          this.displayGPTMessage('调用模型接口失败,请检查网络', timestamp);
          console.error('调用模型接口失败,请检查网络', error);
        }


    },

     displayGPTMessage(fullText, timestamp) {
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      currentText += fullText[index];
      index++;
      this.messages[this.messages.length - 1].text = currentText;

      // 滚动到底部
      this.$nextTick(() => {
        const scrollbar = this.$refs.messageScrollbar.$el.querySelector('.el-scrollbar__wrap');
        scrollbar.scrollTop = scrollbar.scrollHeight;
      });

      if (index === fullText.length) {
        clearInterval(interval);
        this.loading = false;
      }
    }, 10); // 每0.01秒显示一个字

    this.messages.push({
      text: currentText,
      type: 'gpt',
      avatar: require('@/assets/qxyl_logo.png'),
      timestamp,
    });
  },



    formatTime(timestamp) {
      return timestamp;
    },
    getEmrData() {
      const query = this.patientData.records;
      this.patient = this.patientData.patient;

      if (query) {
        try {
          for (let i = 0; i < query.length; i++) {
            this.chatHistory.push({
              title: query[i].病历名称,
              timestamp: query[i].病历时间,
              messages: [
                {
                  text: query[i].病历内容,
                  type: 'gpt',
                  avatar: require('@/assets/qxyl_logo.png'),
                  timestamp: new Date().toLocaleTimeString(),
                },
              ],
            });
          }
        } catch (error) {
          console.error('上个页面跳转过来的信息失败:', error);
        }
      }
    },
  },

   computed:{
     //输入框为空时候，按钮不可用
      isButtonDisabled() {
      return this.inputMessage.trim() === '' || this.loading;
    },
   },
};
</script>



<style scoped>
.chat-container{
  display: flex;
  width: 100%;
  height: 720px;
}
.chat-history {
  width: 20%;
  background-color: white;
  border-right: 1px solid #d1d1d1;
}
.chatgpt-chat {
  display: flex;
  flex-direction: column;
  width: 80%; /* 调整右侧聊天区域的宽度 */
  font-size: 10px !important; /* 整体字体大小调整为12px */
}

.chat-history-scroll {
  overflow-y: auto;
}

.chatgpt-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

::v-deep .chatgpt-chat .message-content .text-wrapper .text {
  font-size: 15px;
}

::v-deep .chatgpt-chat .message-content .timestamp {
  font-size: 15px;
}


.chat-history-item {
  padding: 10px;
  border-bottom: 1px solid #d1d1d1;
  cursor: pointer;
}

.chat-history-item:hover {
  background-color: #f1f1f1;
}

.chat-history-item.selected {  /* 选中的聊天记录项样式 */

   font-weight: bold;
  color: black;

  background-color:#D7D5D5	;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);  /* 添加阴影效果 */
  border-radius: 4px;  /* 可选：添加圆角，让阴影效果更柔和 */

}

.chat-title {
  font-weight: bold;
}

.chat-timestamp {
  font-size: 0.9rem;
  color: black;
}






.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message.user {
  justify-content: flex-end;
}

.message.gpt {
  justify-content: flex-start;
}

.message-content {
  display: flex;
  align-items: center;
  max-width: 70%;
  position: relative;
}

.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;  /* 固定头像大小 */
}

.avatar img {
  width: 100%;
  height: 100%;
}

.text-wrapper {
  display: flex;
  flex-direction: column;
}

.text {
  color: black;
  background-color: white;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-size: 1.2rem;

}

.message.user .text {
  color: black;
  background-color: #F5F5F5;
}

.timestamp {
  font-size: 1rem;
  color: #999;
  margin-top: 5px;
}




.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.input-box >>> .el-textarea__inner {
  font-size: 15px;
  background-color: #f2f2f2 !important;
  border: none !important;
  resize: none; /* 禁止用户手动调整输入框大小 */
}

.send-button {
  background-color: grey;
  font-weight: bold;
  color: white;
  border: none;
  height: 100%; /* 按钮的高度 */
  margin-left: 0px; /* 按钮与输入框之间的间距 */
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);  /* 添加阴影效果 */

}

.send-button:hover {
  background-color: #bebebe;
}

.send-button:disabled {
  background-color: #ccc;
  color: #fff;
  cursor: not-allowed;
}









.dark-mode .text {
  background-color: #444;
  color: #fff;
}

.chat-history-item.disabled {
  pointer-events: none; /* 禁用点击 */
  opacity: 0.5; /* 调整透明度以显示为禁用状态 */
}

.chat-history-item.disabled:hover {
  cursor: not-allowed; /* 鼠标样式为禁止符号 */
}


.loading {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  color: #000; /* 点的颜色为黑色 */
  font-size: 2rem; /* 调大字体 */
  font-weight: bold; /* 加粗点点 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading::after {
  content: '.........'; /* 9个点 */
  display: inline-block;
  animation: dots 1.5s steps(9, end) infinite;
  letter-spacing: 3rem; /* 使点点更紧凑 */
}

@keyframes dots {
  0%, 10% {
    content: '';
  }
  20% {
    content: '.';
  }
  30% {
    content: '..';
  }
  40% {
    content: '...';
  }
  50% {
    content: '....';
  }
  60% {
    content: '.....';
  }
  70% {
    content: '......';
  }
  80% {
    content: '.......';
  }
  90% {
    content: '........';
  }
  100% {
    content: '.........'; /* 最终9个点 */
  }
}



</style>

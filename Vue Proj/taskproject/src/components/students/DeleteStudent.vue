<template>
  <div v-if="showDeletePopup" class="modal">
    <div class="modal-content" style="gap:10px">
      <h3 class="modal-title">Delete Confirmation</h3>
      <p class="modal-message">Are you sure you want to delete the student?</p>
      <div class="modal-buttons">
        <button class="modal-button" @click="cancelDelete">Cancel</button>
        <button class="modal-button" @click="confirmDelete">Yes</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['students', 'showDeletePopup', 'selectedStudentId'],
  data() {
    return {
      activeName: 'first',
      links: [],
      selectedStudent: null,
    };
  },
  methods: {
    cancelDelete() {
      this.$emit('cancel-delete');
    },
    confirmDelete() {
      this.$emit('close', this.selectedStudentId);
    }
  }
};
</script>

<style>
.modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}
.modal-content {
  background-color: #fff;
  padding: 20px 70px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  text-align: center;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.modal-buttons button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  padding: 4px 10px;
  background-color: #e9e9e9;
}
.modal-message {
  margin-bottom: 20px;
}
</style>
<template>
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3 v-if="status === 'add'">Add Student</h3>
      <h3 v-else>Edit Student</h3>
      <form class="modal-form" ref="registerForm" @submit.prevent="saveEditedStudent">
        <div class="column-inputs">
          <div class="form-row">
            <label class="modal-label">Name</label>
            <input
              class="modal-input"
              v-model="student_details.name"
              type="text"
              required
            />
          </div>
          <div class="form-row">
            <label class="modal-label">Date of Birth</label>
            <input
              class="modal-input"
              v-model="student_details.dateOfBirth"
              type="date"
              required
            />
          </div>
          <div class="form-row">
            <label class="modal-label">Municipality</label>
            <input
              class="modal-input"
              v-model="student_details.municipality"
              type="text"
              required
            />
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="$emit('close')">Cancel</button>
          <button type="submit" v-if="status === 'edit'" @click="saveEditedStudent">Save</button>
          <button type="submit" v-else @click="validateAndRegister">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["studentDetails", "status", 'showEditModal', 'students'],
  data() {
    return {
      activeName: "first",
      links: [],
      student_details: {
        name: "",
        dateOfBirth: "",
        municipality: "",
      },
      showDeletePopup: false,
      showRegisterPopup: false,
      validateOnSave: false,
      selectedStudent: null,
      editedStudent: {
        name: "",
        dateOfBirth: "",
        municipality: "",
        students: [],
      },
    };
  },
  mounted() {
    if (this.status === "edit") {
      this.student_details = { ...this.studentDetails };
    }
  },
  methods: {
    editStudent(student) {
      this.selectedStudent = student;
      this.editedStudent = {
        name: student.name,
        dateOfBirth: student.dateOfBirth,
        municipality: student.municipality,
      };
    },
    closeEditModal() {
      this.selectedStudent = null;
      this.editedStudent = {
        name: "",
        dateOfBirth: "",
        municipality: "",
      };
    },
    saveEditedStudent() {
      this.$emit("save-edited-student", this.student_details);
      this.$emit('close');
    },
    openRegisterPopup() {
      this.newStudent = {
        name: "",
        dateOfBirth: "",
        municipality: "",
      };
      this.showRegisterPopup = true;
    },
    closeRegisterPopup() {
      this.showRegisterPopup = false;
    },
    validateAndRegister() {
      if (this.$refs.registerForm && this.$refs.registerForm.checkValidity()) {
        let studentList = this.students
        const newStudentId = studentList.length > 0 ? 
        Math.max(...studentList.map((student) => student.id)) + 1 : 1;

        const newStudent = {
          id: newStudentId,
          name: this.student_details.name,
          dateOfBirth: this.student_details.dateOfBirth,
          municipality: this.student_details.municipality,
        };
        studentList.push(newStudent);

        this.student_details = {
          name: "",
          dateOfBirth: "",
          municipality: "",
        };
        this.showRegisterPopup = false;
        this.$emit('save-edited-student', studentList);
        this.$emit('close');
      } else if (this.$refs.registerForm) {
          this.$refs.registerForm.reportValidity();
      }
    },
  },
};
</script>

<style>
.button {
  gap: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  border: none;
  color: rgb(80, 80, 255);
  text-decoration: underline;
  background-color: white;
}
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
.modal-form {
  display: grid;
  gap: 30px;
  margin-top: 40px;
}
.modal-label {
  font-weight: bold;
}
.modal-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
.form-row {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 10px;
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
.column-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.column-inputs .form-row {
  display: flex;
  align-items: center;
}
.column-inputs .form-row label {
  width: 120px;
  text-align: left;
  padding-right: 10px;
}
</style>
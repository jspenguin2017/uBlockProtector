namespace Script_Compiler
{
    partial class FormMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.TBLog = new System.Windows.Forms.RichTextBox();
            this.BtnBuildRelease = new System.Windows.Forms.Button();
            this.TBGitRoot = new System.Windows.Forms.TextBox();
            this.LabelGitRoot = new System.Windows.Forms.Label();
            this.BtnBuildDev = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // TBLog
            // 
            this.TBLog.Location = new System.Drawing.Point(11, 83);
            this.TBLog.Name = "TBLog";
            this.TBLog.Size = new System.Drawing.Size(862, 468);
            this.TBLog.TabIndex = 7;
            this.TBLog.Text = "";
            this.TBLog.WordWrap = false;
            this.TBLog.TextChanged += new System.EventHandler(this.TBLog_TextChanged);
            // 
            // BtnBuildRelease
            // 
            this.BtnBuildRelease.Font = new System.Drawing.Font("SimSun", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.BtnBuildRelease.Location = new System.Drawing.Point(11, 38);
            this.BtnBuildRelease.Name = "BtnBuildRelease";
            this.BtnBuildRelease.Size = new System.Drawing.Size(500, 39);
            this.BtnBuildRelease.TabIndex = 6;
            this.BtnBuildRelease.Text = "Build Release (To File)";
            this.BtnBuildRelease.UseVisualStyleBackColor = true;
            this.BtnBuildRelease.Click += new System.EventHandler(this.BtnBuildRelease_Click);
            // 
            // TBGitRoot
            // 
            this.TBGitRoot.Location = new System.Drawing.Point(79, 9);
            this.TBGitRoot.Margin = new System.Windows.Forms.Padding(2);
            this.TBGitRoot.Name = "TBGitRoot";
            this.TBGitRoot.Size = new System.Drawing.Size(795, 23);
            this.TBGitRoot.TabIndex = 5;
            // 
            // LabelGitRoot
            // 
            this.LabelGitRoot.AutoSize = true;
            this.LabelGitRoot.Font = new System.Drawing.Font("SimSun", 10F);
            this.LabelGitRoot.Location = new System.Drawing.Point(12, 12);
            this.LabelGitRoot.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.LabelGitRoot.Name = "LabelGitRoot";
            this.LabelGitRoot.Size = new System.Drawing.Size(63, 14);
            this.LabelGitRoot.TabIndex = 4;
            this.LabelGitRoot.Text = "Git Root";
            // 
            // BtnBuildDev
            // 
            this.BtnBuildDev.Font = new System.Drawing.Font("SimSun", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.BtnBuildDev.Location = new System.Drawing.Point(517, 38);
            this.BtnBuildDev.Name = "BtnBuildDev";
            this.BtnBuildDev.Size = new System.Drawing.Size(355, 39);
            this.BtnBuildDev.TabIndex = 8;
            this.BtnBuildDev.Text = "Build Dev (To Clipboard)";
            this.BtnBuildDev.UseVisualStyleBackColor = true;
            this.BtnBuildDev.Click += new System.EventHandler(this.BtnBuildDev_Click);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(884, 561);
            this.Controls.Add(this.BtnBuildDev);
            this.Controls.Add(this.TBLog);
            this.Controls.Add(this.BtnBuildRelease);
            this.Controls.Add(this.TBGitRoot);
            this.Controls.Add(this.LabelGitRoot);
            this.Font = new System.Drawing.Font("SimSun", 10F);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Name = "FormMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Script Compiler";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.RichTextBox TBLog;
        private System.Windows.Forms.Button BtnBuildRelease;
        private System.Windows.Forms.TextBox TBGitRoot;
        private System.Windows.Forms.Label LabelGitRoot;
        private System.Windows.Forms.Button BtnBuildDev;
    }
}


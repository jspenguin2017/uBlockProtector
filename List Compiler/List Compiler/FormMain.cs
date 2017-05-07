using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace List_Compiler
{
    public partial class FormMain : Form
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Default git root directory
        /// </summary>
        private readonly string DefaultGitRoot = Path.Combine(Application.StartupPath, "..");

        /// <summary>
        /// Form load event handler
        /// Set default git root
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FormMain_Load(object sender, EventArgs e)
        {
            TBGitRoot.Text = DefaultGitRoot;
        }

        /// <summary>
        /// Build button click handler
        /// Start compiling
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnBuild_Click(object sender, EventArgs e)
        {
            //Lock elements
            BtnBuild.Enabled = false;
            TBGitRoot.Enabled = false;
            //Cache git root
            string gitRoot = TBGitRoot.Text;
            //Start main process
            await Task.Run(() =>
            {
                //Load everything into RAM
                string[] metadata;
                string[] rules;
                string[] remove;
                string[] originalAAKList;
                //Metadata
                try
                {
                    string path = Path.Combine(gitRoot, "List Compiler\\Metadata.txt");
                    putLog("Reading data from " + path);
                    metadata = File.ReadAllLines(path);
                    putLog(metadata.Length.ToString() + " entries read. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot read file, error message: ");
                    putLog(err.Message);
                    return;
                }
                //Other 3
                if (!loadSkipComments(Path.Combine(gitRoot, "List Compiler\\Rules.txt"), out rules))
                {
                    return;
                }
                if (!loadSkipComments(Path.Combine(gitRoot, "List Compiler\\Remove.txt"), out remove))
                {
                    return;
                }
                if (!loadSkipComments(Path.Combine(gitRoot, "List Compiler\\AAK 10.0 Cache.txt"), out originalAAKList))
                {
                    return;
                }
                //Patch AAK List
                putLog("Patching AAK list... ");
                List<string> patchedAAKList = new List<string>();
                patchedAAKList.Add("! =====Patched Anti-Adblock Killer List=====");
                patchedAAKList.Add("! License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE");
                int counter = 0;
                for (int i = 0; i < originalAAKList.Length; i++)
                {
                    string t = originalAAKList[i];
                    if (remove.Contains(t))
                    {
                        //Skip removed entries
                        counter++;
                    }
                    else
                    {
                        //Put into patched list
                        patchedAAKList.Add(t);
                    }
                }
                putLog(counter.ToString() + " entries removed. ");
                //Combine entries
                string[] toWrite = metadata.Concat(rules).ToArray();
                toWrite = toWrite.Concat(patchedAAKList.ToArray()).ToArray();
                //Write to file
                try
                {
                    string path = Path.Combine(gitRoot, "AdBlockProtectorList.txt");
                    putLog("Writting data to " + path);
                    File.WriteAllLines(path, toWrite);
                    putLog(toWrite.Length.ToString() + " entries wrote. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot write file, error message: ");
                    putLog(err.Message);
                    return;
                }
            });
            //Unlock elements
            BtnBuild.Enabled = true;
            TBGitRoot.Enabled = true;
        }

        /// <summary>
        /// Load a file and filter comments
        /// </summary>
        /// <param name="filePath">The path to the file to read</param>
        /// <param name="data">The output variable</param>
        /// <returns>True if successful, false otherwise</returns>
        private bool loadSkipComments(string filePath, out string[] data)
        {
            string[] original;
            List<string> filtered = new List<string>();
            //Read file
            try
            {
                putLog("Reading data from " + filePath + "... ");
                original = File.ReadAllLines(filePath);
                putLog(original.Length.ToString() + " entries read. ");
            }
            catch (Exception err)
            {
                putLog("Cannot read file, error message: ");
                putLog(err.Message);
                data = new string[0];
                return false;
            }
            //Filter list
            int counter = 0;
            for (int i = 0; i < original.Length; i++)
            {
                string t = original[i];
                if (t == string.Empty || t[0] == '!')
                {
                    //Skip comments and update counter
                    counter++;
                }
                else
                {
                    //Put into filtered list
                    filtered.Add(t);
                }
            }
            putLog(counter.ToString() + " comments removed. ");
            //Return result
            data = filtered.ToArray();
            return true;
        }

        /// <summary>
        /// Write log into log textbox, a new line will be automatically added
        /// This method can be called from another thread
        /// </summary>
        /// <param name="msg">The message to write</param>
        private void putLog(string msg)
        {
            if (TBLog.InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    TBLog.Text += msg + Environment.NewLine;
                }));
            }
            else
            {
                TBLog.Text += msg + Environment.NewLine;
            }
        }

        /// <summary>
        /// Scroll to bottom when data is written to it
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void TBLog_TextChanged(object sender, EventArgs e)
        {
            TBLog.SelectionStart = TBLog.Text.Length;
            TBLog.ScrollToCaret();
        }
    }
}
